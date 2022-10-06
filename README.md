<p align="center"><a  href="https://laudspeaker.com/"><img  src="https://user-images.githubusercontent.com/7728266/194206039-0faecc9d-c500-4c64-8401-dfbefe501e4a.png"  alt="Laudspeaker - Open Source Customer Messaging Workflows"  height="50"/></a></p>


<p align="center"><b>Open source customer messaging and notification workflow software</b></p>

<br/>

  

#  Laudspeaker PostHog Plugin
<br>

  | **Send events from PostHog to Laudspeaker** |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

  

Questions? Please join our [Slack channel](https://laudspeakerusers.slack.com/ssb/redirect) or visit our [site]((https://laudspeaker.com/)).

<br>

  
## Get Started

 - To experience the full power of laudspeaker we recommend you import your posthog users first via the event integration on laudspeakers application 
 -  Create a PostHog source in your [RudderStack dashboard](https://app.rudderstack.com/). Learn more about adding a source in RudderStack [here](https://docs.rudderstack.com/get-started/adding-source-and-destination-rudderstack).
   
 ![PH-init](https://github.com/rudderlabs/rudderstack-posthog-plugin/blob/master/images/PH-init.png)

 - After adding the source, it should look something like the following:

 ![PH-source](https://user-images.githubusercontent.com/59817155/109136455-2416f100-777e-11eb-83db-342bee7f119b.png)

 - Get the source `write-key` and your `RudderStack server URL` (also called the `Data Plane URL`).
 - Copy this repo URL.
 - Go to your PostHog dashboard, and add a custom plugin with this URL.

  ![PH-plugin](https://github.com/rudderlabs/rudderstack-posthog-plugin/blob/master/images/Screenshot%202021-02-22%20at%207.49.50%20PM.png)
  
 - Once added successfully, you will need to configure the RudderStack plugin with the source write key and RudderStack server URL that you copied above. The default RudderStack server URL is configured to https://hosted.rudderlabs.com/v1/batch. Append `v1/batch` to this URL.

 ![PH-plugin-config](https://github.com/rudderlabs/rudderstack-posthog-plugin/blob/master/images/Screenshot%202021-02-22%20at%207.50.55%20PM.png)

 - Finally, enable this plugin and you should start seeing events sent to your PostHog instance flowing to this RudderStack source.

  For more info on PostHog plugins, check [this](https://posthog.com/docs/plugins/overview).

## License

**RudderStack PostHog Plugin** is released under the [MIT License][mit_license].

## Contribute 

We would love to see you contribute to RudderStack. Get more information on how to contribute [here](CONTRIBUTING.md).

## Follow Us

-  [Slack][slack]

-  [Twitter][twitter]

<!--- 
-  [Laudspeaker Blog][laudspeaker-blog]

-  [LinkedIn][linkedin]

-  [dev.to][devto]

-  [Medium][medium]

-  [YouTube][youtube]

-  [HackerNews][hackernews]

-  [Product Hunt][producthunt]
-->

[slack]: [https://laudspeakerusers.slack.com/ssb/redirect]
[twitter]: [https://twitter.com/laudspeaker]
<!---[devto]: https://dev.to/rudderstack
[youtube]: https://www.youtube.com/channel/UCgV-B77bV_-LOmKYHw8jvBw
[laudspeaker-blog]: https://laudspeaker.com/blog/
[hackernews]: https://news.ycombinator.com/
[producthunt]: https://www.producthunt.com/posts/laudspeaker
[agplv3_license]: https://www.gnu.org/licenses/agpl-3.0-standalone.html
[laudspeaker_ee_license]: https://www.mongodb.com/licensing/server-side-public-license
[mit_license]: https://opensource.org/licenses/MIT
-->
