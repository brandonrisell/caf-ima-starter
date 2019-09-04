import { u as useEffect, h as html, c as component } from './haunted-1f17bfda.js';

const customVideoPlayer = ({ visible }) => {
  useEffect(() => {
    const context = cast.framework.CastReceiverContext.getInstance();
    const playerManager = context.getPlayerManager();
    const videoComponent = document.querySelector("custom-video-player");
    // const videoElement = videoComponent.shadowRoot.querySelector(
    //   ".castMediaElement"
    // );
    const videoElement = document.querySelector(".castMediaElement");
    // const playerDataBinder = new cast.framework.ui.PlayerDataBinder(playerData);
    let loadData;

    // Set video element
    playerManager.setMediaElement(videoElement);

    // Intercept LOAD requests and save the promise
    playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.LOAD,
      requestData => {
        const { customData, streamType } = requestData.media;
        const STREAM_TYPE_LIVE = window.cast.framework.messages.StreamType.LIVE;
        const STREAM_TYPE_BUFFERED =
          window.cast.framework.messages.StreamType.BUFFERED;

        const imaRequestData = customData.imaRequestData || {
          assetKey: customData.assetKey || "",
          contentSourceId: customData.contentSourceId || "",
          videoId: customData.videoId || "",
          authToken: customData.authToken || "",
          needsCredentials: customData.needsCredentials || false,
          format:
            customData.format ||
            google.ima.dai.api.StreamRequest.StreamFormat.HLS,
          adTagParameters: customData.adTagParameters || {}
        };
        imaRequestData.adTagParameters["iu"] = "/4145/fnc.videos/ccast/clip";

        // Append token to segment requests
        const playbackConfig = Object.assign(
          new window.cast.framework.PlaybackConfig(),
          playerManager.getPlaybackConfig()
        );
        playbackConfig.manifestRequestHandler = networkRequest => {
          if (
            imaRequestData.needsCredentials &&
            imaRequestData.authToken !== ""
          ) {
            // eslint-disable-next-line no-param-reassign
            networkRequest.withCredentials = true;
            const divider = /\?/.test(networkRequest.url) ? "&" : "?";
            // eslint-disable-next-line no-param-reassign
            networkRequest.url += `${divider}${imaRequestData.authToken}`;
          }
          return networkRequest;
        };
        playbackConfig.segmentRequestHandler = networkRequest => {
          if (imaRequestData.needsCredentials) {
            // eslint-disable-next-line no-param-reassign
            networkRequest.withCredentials = true;
          }
          return networkRequest;
        };
        playerManager.setPlaybackConfig(playbackConfig);

        return new Promise((resolve, reject) => {
          // Set the request and promise resolution functions in `CastPlayer`
          loadData = { requestData, resolve, reject };

          if (
            streamType === STREAM_TYPE_LIVE &&
            imaRequestData.assetKey !== ""
          ) {
            streamManager.requestStream(
              new google.ima.dai.api.LiveStreamRequest(imaRequestData)
            );
          } else if (
            streamType === STREAM_TYPE_BUFFERED &&
            imaRequestData.contentSourceId !== "" &&
            imaRequestData.videoId !== ""
          ) {
            streamManager.requestStream(
              new google.ima.dai.api.VODStreamRequest(imaRequestData)
            );
          } else {
            // If neither the assetKey or the contentSourceId are set, just load the request as-is
            resolve(requestData);
          }
        });
      }
    );

    // IMA StreamManager
    const streamManager = new google.ima.dai.api.StreamManager(videoElement);
    streamManager.addEventListener(
      google.ima.dai.api.StreamEvent.Type.LOADED,
      event => {
        loadData.requestData.media["contentUrl"] = event.getStreamData().url;
        loadData.resolve(loadData.requestData);
      }
    );
    // streamManager.addEventListener(
    //   google.ima.dai.api.StreamEvent.Type.CUEPOINTS_CHANGED,
    //   event => {
    //     const breakClips = [];
    //     const breaks = [];
    //     event.getStreamData().cuepoints.forEach((cuepoint, index) => {
    //       breakClips.push({
    //         id: `clip${index}`,
    //         duration: cuepoint.end - cuepoint.start
    //       });
    //       breaks.push({
    //         id: `break${index}`,
    //         duration: cuepoint.end - cuepoint.start,
    //         breakClipIds: [`clip${index}`],
    //         isEmbedded: true,
    //         isWatched: false,
    //         position: streamManager.contentTimeForStreamTime(cuepoint.start)
    //       });
    //     });
    //     loadData.requestData.media["breakClips"] = breakClips;
    //     loadData.requestData.media["breaks"] = breaks;
    //   }
    // );

    // Update ui according to player state
    // playerDataBinder.addEventListener(
    //   cast.framework.ui.PlayerDataEventType.STATE_CHANGED,
    //   e => {
    //     switch (e.value) {
    //       case cast.framework.ui.State.LAUNCHING:
    //       case cast.framework.ui.State.IDLE:
    //         videoComponent.setAttribute("visible", "false");
    //         break;
    //       case cast.framework.ui.State.LOADING:
    //         // Write your own event handling code
    //         break;
    //       case cast.framework.ui.State.BUFFERING:
    //         // Write your own event handling code
    //         break;
    //       case cast.framework.ui.State.PAUSED:
    //         // Write your own event handling code
    //         break;
    //       case cast.framework.ui.State.PLAYING:
    //         // Write your own event handling code
    //         videoComponent.setAttribute("visible", "true");
    //         break;
    //     }
    //   }
    // );

    context.start();
  }, []);
  return html`
    <style>
      :host {
      }
    </style>
  `;
};

if (!customElements.get("custom-video-player")) {
  customElements.define("custom-video-player", component(customVideoPlayer));
}

export default customVideoPlayer;
