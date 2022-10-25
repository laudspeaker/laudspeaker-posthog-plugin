<p align="center"><a  href="https://laudspeaker.com/"><img  src="https://user-images.githubusercontent.com/7728266/194206039-0faecc9d-c500-4c64-8401-dfbefe501e4a.png"  alt="Laudspeaker - Open Source Customer Messaging Workflows"  height="50"/></a></p>


<p align="center"><b>Open source customer messaging and notification workflow software</b></p>

<br/>

#  Laudspeaker PostHog Plugin

## Why use PostHog and Laudspeaker?

Laudspeaker is an open source omnichannel customer messaging SaaS. It is an alternative to Braze, Iterable, customer io and many many other options. Its designed to be developer friendly and easy to use. And you can use our journey tool to easily create event-triggered, or time triggered user notifications. 

PostHog is open source product analytics so we can go hand in hand! We believe we are the easiest tool to use with PostHog to set things up like automated  onboarding emails. If a user completes an action in PostHog, have an automated message reach them when, where and how you want!

## Send events from PostHog to Laudspeaker

Questions? Please join our [Slack channel](https://laudspeakerusers.slack.com/ssb/redirect) or visit our [site](https://laudspeaker.com/).

<br>

  
### Get Started

 - To experience the full power of laudspeaker we recommend you import your PostHog users first via the event integration on [laudspeakers application](https://app.laudspeaker.com) 
 <!--- (https:/loom.com/). -->
 
 <img width="1242" alt="Screen Shot 2022-10-20 at 12 46 10 PM" src="https://user-images.githubusercontent.com/7728266/196940398-34bb1f95-724f-4e6c-a37d-e01fcae2b240.png">
   
 - After configuring PostHog on our application, install the plugin, and provide your api for `write-key`, which you can find in settings:

 <img width="1514" alt="Screen Shot 2022-10-20 at 12 42 58 PM" src="https://user-images.githubusercontent.com/7728266/196939484-6961d8af-b198-4694-9770-26f0584601ef.png">
 
 - provide `[your_server's_url]/events/posthog` for `Lauspeaker URL` (or if using our hosted plan just use `app.laudspeaker.com/events/posthog`). The other fields (email, phone number, custom) are optional and can be specified if you want to be able to message people from posthog through those channels with laudspeaker 
 
 - Then enable the plugin and you should start seeing events sent to laudspeaker. 
 
 - For a full tutorial on using laudspeaker with PostHog check out our documentation. Where we go through an example!
 
### Video Walkthrough

Check out how to set up and trigger an email in our [video](https://vimeo.com/763728112)


### License

**Laudspeaker PostHog Plugin** is released under the [MIT License][mit_license].

### Contribute 

We would love to see you contribute to Laudspeaker. Join our slack to get involved

### Follow Us

-  [Slack][slack]

-  [Twitter][twitter]

[slack]: https://laudspeakerusers.slack.com/ssb/redirect
[twitter]: https://twitter.com/laudspeaker
[mit_license]: https://opensource.org/licenses/MIT

<!--- 
-  [Laudspeaker Blog][laudspeaker-blog]

-  [LinkedIn][linkedin]

-  [dev.to][devto]

-  [Medium][medium]

-  [YouTube][youtube]

-  [HackerNews][hackernews]

-  [Product Hunt][producthunt]
-->


<!---[devto]: https://dev.to/rudderstack
[youtube]: https://www.youtube.com/channel/UCgV-B77bV_-LOmKYHw8jvBw
[laudspeaker-blog]: https://laudspeaker.com/blog/
[hackernews]: https://news.ycombinator.com/
[producthunt]: https://www.producthunt.com/posts/laudspeaker
[agplv3_license]: https://www.gnu.org/licenses/agpl-3.0-standalone.html
[laudspeaker_ee_license]: https://www.mongodb.com/licensing/server-side-public-license

-->
