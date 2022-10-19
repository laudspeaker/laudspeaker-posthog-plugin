import { createBuffer } from '@posthog/plugin-contrib'

const alias = {
    userId: 'properties.alias',
    previousId: ['properties.distinct_id'],
}

const page = {
    name: 'properties.name',
    'properties.category': 'properties.category',
    'properties.host': 'properties.$host',
    'properties.url': 'properties.$current_url',
    'properties.path': 'properties.$pathname',
    'properties.referrer': 'properties.$referrer',
    'properties.initial_referrer': 'properties.$initial_referrer',
    'properties.referring_domain': 'properties.$referring_domain',
    'properties.initial_referring_domain': 'properties.$initial_referring_domain',
}

const identify = {
    'context.traits': '$set',
    traits: '$set',
}

const group = {
    groupId: 'groupId',
    traits: 'traits',
}

const track = {
    event: 'event',
}

const constants = {
    'context.app.name': 'PostHogPlugin',
    channel: 's2s',
}

// TODO: handle "context.channel" better
const generic = {
    'context.os.name': 'properties.$os',
    'context.browser': 'properties.$browser',
    'context.page.host': 'properties.$host',
    'context.page.url': 'properties.$current_url',
    'context.page.path': 'properties.$pathname',
    'context.page.referrer': 'properties.$referrer',
    'context.page.initial_referrer': 'properties.$initial_referrer',
    'context.page.referring_domain': 'properties.$referring_domain',
    'context.app.version': 'properties.posthog_version',
    'context.page.initial_referring_domain': 'properties.$initial_referring_domain',
    'context.browser_version': 'properties.$browser_version',
    'context.screen.height': 'properties.$screen_height',
    'context.screen.width': 'properties.$screen_width',
    'context.library.name': 'properties.$lib',
    'context.library.version': 'properties.$lib_version',
    'context.ip': 'ip',
    messageId: '$insert_id',
    originalTimestamp: 'timestamp',
    userId: ['$user_id', 'distinct_id'],
    anonymousId: ['properties.$anon_distinct_id', 'properties.$device_id', 'properties.distinct_id'],
    'context.active_feature_flags': 'properties.$active_feature_flags',
    'context.posthog_version': 'properties.posthog_version',
    'context.has_slack_webhook': 'properties.has_slack_webhook',
    'context.token': 'properties.token',
}

const autoCapture = {
    event: 'properties.$event_type',
    'properties.elements': 'properties.$elements',
}

const eventToMapping = {
    $identify: { type: 'identify', mapping: identify },
    $create_alias: { type: 'alias', mapping: alias },
    $pageview: { type: 'page', mapping: page },
    $page: { type: 'page', mapping: page },
    $group: { type: 'group', mapping: group },
    $autocapture: { type: 'track', mapping: autoCapture },
    default: { type: 'track', mapping: track },
}

function set(target, path, value) {
    let keys = path.split('.')
    let len = keys.length

    for (let i = 0; i < len; i++) {
        let prop = keys[i]

        if (!isObject(target[prop])) {
            target[prop] = {}
        }

        if (i === len - 1) {
            result(target, prop, value)
            break
        }

        target = target[prop]
    }
}

function result(target, path, value) {
    target[path] = value
}

function isObject(val) {
    return val !== null && (typeof val === 'object' || typeof val === 'function')
}


// Ref: https://github.com/jonschlinkert/get-value
function get(target, path, options) {
    if (!isObject(options)) {
        options = { default: options }
    }

    if (!isValidObject(target)) {
        return typeof options.default !== 'undefined' ? options.default : target
    }

    if (typeof path === 'number') {
        path = String(path)
    }

    const isArray = Array.isArray(path)
    const isString = typeof path === 'string'
    const splitChar = options.separator || '.'
    const joinChar = options.joinChar || (typeof splitChar === 'string' ? splitChar : '.')

    if (!isString && !isArray) {
        return target
    }

    if (isString && path in target) {
        return isValid(path, target, options) ? target[path] : options.default
    }

    let segs = isArray ? path : split(path, splitChar, options)
    let len = segs.length
    let idx = 0

    do {
        let prop = segs[idx]
        if (typeof prop === 'number') {
            prop = String(prop)
        }

        while (prop && prop.slice(-1) === '\\') {
            prop = join([prop.slice(0, -1), segs[++idx] || ''], joinChar, options)
        }

        if (prop in target) {
            if (!isValid(prop, target, options)) {
                return options.default
            }

            target = target[prop]
        } else {
            let hasProp = false
            let n = idx + 1

            while (n < len) {
                prop = join([prop, segs[n++]], joinChar, options)

                if ((hasProp = prop in target)) {
                    if (!isValid(prop, target, options)) {
                        return options.default
                    }

                    target = target[prop]
                    idx = n - 1
                    break
                }
            }

            if (!hasProp) {
                return options.default
            }
        }
    } while (++idx < len && isValidObject(target))

    if (idx === len) {
        return target
    }

    return options.default
}

function join(segs, joinChar, options) {
    if (typeof options.join === 'function') {
        return options.join(segs)
    }
    return segs[0] + joinChar + segs[1]
}

function split(path, splitChar, options) {
    if (typeof options.split === 'function') {
        return options.split(path)
    }
    return path.split(splitChar)
}

function isValid(key, target, options) {
    if (typeof options.isValid === 'function') {
        return options.isValid(key, target)
    }
    return true
}

function isValidObject(val) {
    return isObject(val) || Array.isArray(val) || typeof val === 'function'
}

export const jobs = {
    uploadBatchToLaud: async (batch, meta) => {
        // We'll retry 15 times using an exponential backoff mechanism
        // The first retry happens in 3s, and the last in about 50min
        if (batch.retriesPerformedSoFar >= 15) {
            return
        }
        await sendToLaud(batch, meta)
    },
}

export async function setupPlugin({ config, global, jobs }) {
    const laudBase64AuthToken = Buffer.from(`${config.writeKey}:`).toString('base64')

    global.laudAuthHeader = {
        headers: {
            Authorization: `Api-Key ${config.writeKey}`,
        },
    }
    global.writeKey = config.writeKey
    global.dataPlaneUrl = config.dataPlaneUrl

    // Setup a buffer to group events to be sent to laudspeaker in the background at most every 60s
    global.buffer = createBuffer({
        limit: 5 * 1024 * 1024, // 5mb max
        timeoutSeconds: 60,
        onFlush: async (batch) => {
            await sendToLaud(
                { batch, retriesPerformedSoFar: 0, batchId: Math.floor(Math.random() * 1000000) }, // This is the first time we're trying to send the payload
                { global, jobs }
            )
        },
    })
}

// onEvent is used to export events without modifying them
export async function onEvent(event, { config, global }) {
    let laudspeakerPayload = {}
    // add const value props
    constructPayload(laudspeakerPayload, event, constants, true)

    // add generic props
    constructPayload(laudspeakerPayload, event, generic)

    // get specific event props
    const eventName = get(event, 'event')
    const { type, mapping } = eventToMapping[eventName] ? eventToMapping[eventName] : eventToMapping['default']

    //set laud payload type
    set(laudspeakerPayload, 'type', type)

    // set laud event props
    constructPayload(laudspeakerPayload, event, mapping)

    // add all pther posthog keys under props not starting with $ to laud payload properties
    Object.keys(event.properties).forEach((propKey) => {
        if (propKey.slice(0, 1) != '$' && event.properties[propKey] != undefined && event.properties[propKey] != null) {
            set(laudspeakerPayload, `properties.${propKey}`, event.properties[propKey])
        }
    })

    //check for messageId 
    //add if not
    if (!("messageId" in laudspeakerPayload)) {
        if ("$insert_id" in event.properties) {
            laudspeakerPayload['messageId'] = event.properties["$insert_id"]
        }
        else {

        }
    }

    //check for event name 
    //add if not
    if (!("event" in laudspeakerPayload)) {
        if ("event" in event) {
            laudspeakerPayload['event'] = event["event"]
        }
        else {

        }
    }

    console.log("request path is " + '/api/projects/@current/persons/' + event.distinct_id );
    const res = await posthog.api.get('/api/projects/@current/persons/' + event.distinct_id)
    const user = await res.json();
    console.log("User is ", JSON.stringify(user))
    if (!(config.phEmail in laudspeakerPayload) && config.phEmail) {
        laudspeakerPayload.phEmail = user[config.phEmail];
    }

    if (!(config.phPhoneNumber in laudspeakerPayload) && config.phPhoneNumber) {
        laudspeakerPayload.phPhoneNumber = user[config.phPhoneNumber];
    }

    if (!(config.phCustom in laudspeakerPayload) && config.phCustom) {
        laudspeakerPayload.phCustom = user[config.phCustom];
    }

    // Add event to the buffer which will flush in the background
    global.buffer.add(laudspeakerPayload, JSON.stringify(laudspeakerPayload).length)
}

async function sendToLaud(batch, { global, jobs }) {
    try {
        const payload = {
            batch: batch.batch,
            sentAt: new Date().toISOString(),
        }
        await fetch(global.dataPlaneUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...global.laudAuthHeader.headers,
            },
            body: JSON.stringify(payload),
            method: 'POST',
        })
        console.log(`Successfully uploaded events batch ${batch.batchId} of size ${batch.batch.length} to laudspeaker`)
    } catch (err) {
        // Retry using exponential backoff based on how many retries were already performed
        const nextRetryMs = 2 ** (batch.retriesPerformedSoFar || 0) * 3000 // 2^0 * 3000 = 3000ms, 2^9 * 3000 = 1,536,000ms
        console.error(`Error uploading payload to laudspeaker: ${err}`)
        console.log(`Enqueued batch ${batch.batchId} for retry in ${Math.round(nextRetryMs / 1000)}s`)
        await jobs
            .uploadBatchToLaud({
                ...batch,
                retriesPerformedSoFar: (batch.retriesPerformedSoFar || 0) + 1,
            })
            .runIn(nextRetryMs, 'milliseconds')
    }
}

function constructPayload(outPayload, inPayload, mapping, direct = false) {
    Object.keys(mapping).forEach((laudKeyPath) => {
        let pHKeyPath = mapping[laudKeyPath]
        let pHKeyVal = undefined
        if (direct) {
            pHKeyVal = pHKeyPath
        } else if (Array.isArray(pHKeyPath)) {
            for (let i = 0; i < pHKeyPath.length; i++) {
                pHKeyVal = get(inPayload, pHKeyPath[i])
                if (pHKeyVal) {
                    break
                }
            }
        } else {
            pHKeyVal = get(inPayload, pHKeyPath)
        }
        if (pHKeyVal != undefined && pHKeyVal != null) {
            set(outPayload, laudKeyPath, pHKeyVal)
        }
    })
}
