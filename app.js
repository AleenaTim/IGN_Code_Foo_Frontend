var vidUrl = [];
var vidThumbnail = [];
var vidTitle = [];
var vidDescription = [];
runApp();

function runApp() {
  $.ajax({
    type: "GET",
    url: "https://ign-apis.herokuapp.com/videos?startIndex=30&count=5",
    dataType: "JSONP",

    success: function (info) {
      $("#firstvid").append(`
      <div class="video-player">
          <video id="myVideo" poster="${info.data[0].thumbnails[2].url}">
					<source src="${info.data[0].assets[3].url}" type="video/mp4" class="video">    
          </video>
          <!--Buttons-->
          <div class="player-controls">
          <div class="video-progress">
            <div class="video-progress-filled"></div>
          </div>
          <div class="left-side-controls">
          <button id="volumeNone" class="hidden"><i class="fa fa-volume-off"></i></button>
          <button id="volumeLow" class="hidden"><i class="fa fa-volume-down"></i></button>
          <button id="volumeHigh"><i class="fa fa-volume-up"></i></button>
          <input type="range" class="volume" min="0" max="1" step="0.01" value=".5"/>
          <button id="skipBackward" class="noClick"><i class="fa fa-step-backward"></i></button>
          <button id="btnPlay"><i class="fa fa-play-circle-o"></i></button>
          <button id="btnPause" class="hidden"><i class="fa fa-pause-circle-o"></i></button>
          <button id="skipForward"><i class="fa fa-step-forward"></i></button>   
          </div>  
          <div class="right-side-controls">
          <output id="timeOut"></output>    
          <button id="maxMin"><i class="fa fa-window-maximize"></i></button>
          </div>
          </div>
          </div>
          <output id="vidNum"></output>
          <h3 class="title">${info.data[0].metadata.title}</h3>
          <h4 class="description">${info.data[0].metadata.description}</h4>          
      `);

      for (let i = 0; i < 5; i++) {
        $(`#vid${i}`).append(`
            <video src="${info.data[i].assets[3].url}" poster="${info.data[i].thumbnails[2].url}">
            </video> 
            <h3 class="title">${info.data[i].metadata.title}</h3><h4 hidden class="description">${info.data[i].metadata.description}</h4>
        `);

        vidUrl.push(info.data[i].assets[3].url);
        vidThumbnail.push(info.data[i].thumbnails[2].url);
        vidTitle.push(info.data[i].metadata.title);
        vidDescription.push(info.data[i].metadata.description);
      }

      function playPause() {
        if (myVideo.paused) {
          btnPlay.classList.add("hidden");
          btnPause.classList.remove("hidden");
          myVideo.play();
          timer = setInterval(update, 100);
        } else {
          btnPlay.classList.remove("hidden");
          btnPause.classList.add("hidden");
          myVideo.pause();
        }
      }

      function screenChange() {
        if (!document.fullscreenElement) {
          videoPlayer.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }

      let vidPlaying = 0;
      let timer = null;
      const myVideo = document.getElementById("myVideo");
      const btnPlay = document.getElementById("btnPlay");
      const btnPause = document.getElementById("btnPause");
      const volumeNone = document.getElementById("volumeNone");
      const volumeLow = document.getElementById("volumeLow");
      const volumeHigh = document.getElementById("volumeHigh");
      const skipBackward = document.getElementById("skipBackward");
      const skipForward = document.getElementById("skipForward");
      const maxMin = document.getElementById("maxMin");
      const timeOut = document.getElementById("timeOut");
      const vidNumOut = document.getElementById("vidNum");
      const volume = document.querySelector(".volume");
      const progress = document.querySelector(".video-progress");
      const progressBar = document.querySelector(".video-progress-filled");
      myVideo.addEventListener("dblclick", screenChange);
      btnPlay.addEventListener("click", playPause);
      btnPause.addEventListener("click", playPause);
      myVideo.addEventListener("click", playPause);
      myVideo.addEventListener("ended", nextVideo);
      skipForward.addEventListener("click", nextVideo);
      skipBackward.addEventListener("click", previousVideo);
      maxMin.addEventListener("click", screenChange);
      const videoPlayer = document.querySelector(".video-player");
      let listVideo = document.querySelectorAll(".video-list .vid");
      let thumbnail = document.querySelectorAll(".video-list .poster");
      let mainVideo = document.querySelector(".main-video video");
      let title = document.querySelector(".main-video .title");
      let description = document.querySelector(".main-video .description");
      vidNumOut.innerHTML =
        "Video Playlist: " + (vidPlaying + 1) + " / " + vidUrl.length;

      function nextVideo() {
        listVideo[vidPlaying].classList.remove("active");
        if (vidPlaying < vidUrl.length - 1) {
          skipBackward.classList.remove("noClick");
          clearInterval(timer);
          vidPlaying++;
        } else {
          vidPlaying = 0;
          skipBackward.classList.add("noClick");
          skipForward.classList.remove("noClick");
        }
        setVid();
      }

      function previousVideo() {
        listVideo[vidPlaying].classList.remove("active");
        if (vidPlaying > 0) {
          vidPlaying--;
        }
        else {
          skipBackward.classList.add("noClick");
        }
        setVid();
      }

      function setVid() {
        mainVideo.src = vidUrl[vidPlaying];
        mainVideo.poster = vidThumbnail[vidPlaying];
        title.innerHTML = vidTitle[vidPlaying];
        description.innerHTML = vidDescription[vidPlaying];
        vidNumOut.innerHTML =
          "Video Playlist: " + (vidPlaying + 1) + " / " + vidUrl.length;
        listVideo[vidPlaying].classList.add("active");
        if (vidPlaying > 0) {
          playPause();
        } else {
          btnPlay.classList.remove("hidden");
          btnPause.classList.add("hidden");
        }
      }

      document.addEventListener("keydown", (event) => {
        if (event.keyCode == 32 && event.target == document.body) {
          event.preventDefault();
          playPause();
        }
      });

      function update() {
        timeOut.innerHTML =
          myTime(myVideo.currentTime) + " / " + myTime(myVideo.duration);
        const percentage = (myVideo.currentTime / myVideo.duration) * 100;
        progressBar.style.width = `${percentage}%`;
      }

      function myTime(time) {
        var hr = ~~(time / 3600);
        var min = ~~((time % 3600) / 60);
        var sec = time % 60;
        var sec_min = "";
        if (hr > 0) {
          sec_min += "" + hr + ":" + (min < 10 ? "0" : "");
        }
        sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
        sec_min += "" + Math.round(sec);
        return sec_min;
      }

      function time_convert(num) {
        var hours = Math.floor(num / 60);
        var minutes = num % 60;
        return hours + ":" + minutes;
      }

      volume.addEventListener("mousemove", (e) => {
        myVideo.volume = e.target.value;
        if (myVideo.volume <= 0) {
          volumeNone.classList.remove("hidden");
          volumeLow.classList.add("hidden");
          volumeHigh.classList.add("hidden");
        } else if (myVideo.volume < 0.5 && myVideo.volume > 0) {
          volumeNone.classList.add("hidden");
          volumeLow.classList.remove("hidden");
          volumeHigh.classList.add("hidden");
        } else if (myVideo.volume >= 0.5) {
          volumeNone.classList.add("hidden");
          volumeLow.classList.add("hidden");
          volumeHigh.classList.remove("hidden");
        }
      });

      //change progress bar on click
      progress.addEventListener("click", (e) => {
        const progressTime =
          (e.offsetX / progress.offsetWidth) * myVideo.duration;
        myVideo.currentTime = progressTime;
      });
    },
  });
} //end of function
