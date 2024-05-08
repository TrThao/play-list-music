const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "MY_PLAYER";
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const RandomBtn = $(".btn-random");
const playList = $(".playlist");
const repeatBtn = $(".btn-repeat");

// Tăng giảm âm lượng
const volumeSlider = $("#volume");

const totalTimeElement = $(".total-time"); // Phần tử hiển thị tổng thời gian
const currentTimeElement = $(".current-time"); // Phần tử hiển thị thời gian hiện tại

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  configs: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "500 Miles",
      singer: "Justin Timberlake",
      path: "https://audio.jukehost.co.uk/60r5S2rNFQpCSnKirIGNlzveSs6klXAv",
      image: "https://i1.sndcdn.com/artworks-000112928659-83o8mj-t500x500.jpg",
    },
    {
      name: "Tiễn Em Lần Cuối",
      singer: "Trung Hành",
      path: "https://audio.jukehost.co.uk/aLNQRm4NYccoi6rXztg3ED2IiBBq7W5d",
      image:
        "https://avatar-ex-swe.nixcdn.com/singer/avatar/2014/03/31/3/9/8/6/1396249140056_600.jpg",
    },
    {
      name: "LK Người Tình Ngàn Dặm",
      singer: "Ngọc Lan Trang",
      path: "https://audio.jukehost.co.uk/LIAT2DoIiPbvxadiX6CdtPeuh8mWk7Ol",
      image:
        "https://images2.thanhnien.vn/zoom/700_438/528068263637045248/2023/7/9/ngoc-lan-trang-1688897249072488991546-216-0-1069-1364-crop-1688897495755158013134.jpeg",
    },
    {
      name: "Self Control",
      singer: "Laura Branigan",
      path: "https://audio.jukehost.co.uk/QdT6rBnVGgliy48Hw6u8UrjgyNkHzUgo",
      image: "https://www.djprince.no/covers/laura.jpg",
    },
    {
      name: "Cheri Cheri Lady",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/G3UvJpmWYX90v2YJaZvAnk7AvFxv7576",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
    {
      name: "Brother Louie",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/nl1jkex593GkE0fhRh1BkJqaexRBmmER",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
    {
      name: "You are My Heart, You are My Soul",
      singer: "Modern Talking",
      path: "https://audio.jukehost.co.uk/Ov9BVMZmWRW8Vs54pZZqf48baFBvhdmt",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/c/a/b/5/cab58a4408a7c356d5db85b1fa31487f.jpg",
    },
  ],
  setconfigs: function (key, value) {
    this.configs[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.configs));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div class="thumb" style="background-image: url(${
                      song.image
                    });"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
    });
    playList.innerHTML = htmls.join("");
  },
  defindProperties() {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

    this.setconfigs("currentIndex", this.currentIndex);
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1; // Sửa lại để quay về bài hát cuối cùng khi ấn prev ở bài hát đầu tiên
    }
    this.loadCurrentSong();
  },

  ranDomSong: function () {
    const playedSongs = new Set(); // Tạo một Set để lưu trữ các bài hát đã phát

    // Hàm kiểm tra xem bài hát có trong Set đã phát hay không
    const isPlayed = (index) => playedSongs.has(index);

    let newIndex;

    // Nếu đã phát hết tất cả các bài hát thì quay lại bài hát đầu tiên
    if (playedSongs.size === this.songs.length) {
      playedSongs.clear(); // Xóa danh sách bài hát đã phát để bắt đầu lại từ đầu
    }

    // Lặp để chọn một bài hát không trùng lặp
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (isPlayed(newIndex)); // Kiểm tra xem bài hát đã phát hay chưa

    // Thêm bài hát mới vào danh sách đã phát
    playedSongs.add(newIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  loadConfig: function () {
    //load-configs
    this.isRandom = this.configs.isRandom;
    this.isRepeat = this.configs.isRepeat;
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // Xử lý cd quay và dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    // Xử lý phóng to thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;

      // Xử lý khi play
      playBtn.onclick = function () {
        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      };

      // Khi song được play
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
        cdThumbAnimate.play();
      };

      // Khi song bị pause
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
        cdThumbAnimate.pause();
      };

      // Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progresPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progresPercent;

          // Cập nhật thời gian hiện tại
          const currentTime = _this.formatTime(audio.currentTime);
          currentTimeElement.textContent = currentTime;
        }
      };

      // Xử lý khi click vào thanh tiến trình
      progress.oninput = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;
        audio.currentTime = seekTime;

        // Cập nhật thời gian hiện tại
        const currentTime = _this.formatTime(seekTime);
        currentTimeElement.textContent = currentTime;
      };

      // Xử lý nút next
      nextBtn.onclick = function () {
        if (_this.isRandom) {
          _this.ranDomSong();
          audio.play();
        } else {
          _this.nextSong();
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
        }
      };

      // Xử lý nút prev
      prevBtn.onclick = function () {
        if (_this.isRandom) {
          _this.ranDomSong();
          audio.play();
        } else {
          _this.prevSong();
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
        }
      };

      // Khi click nút random
      RandomBtn.onclick = function (e) {
        _this.isRandom = !_this.isRandom;
        _this.setconfigs("isRandom", _this.isRandom);
        RandomBtn.classList.toggle("active", _this.isRandom);
      };

      // Xử lý sự kiện khi bài hát kết thúc
      audio.onended = function () {
        if (_this.isRepeat) {
          audio.play();
        } else {
          nextBtn.click();
        }
      };

      // Khi click vào nút repeat
      repeatBtn.onclick = function (e) {
        _this.isRepeat = !_this.isRepeat;
        _this.setconfigs("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle("active", _this.isRepeat);
      };

      // Xử lý sự kiện khi click vào playlist
      playList.onclick = function (e) {
        const songNode = e.target.closest(".song:not(.active)");
        if (songNode || e.target.closest(".option")) {
          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong();
            _this.render();
            audio.play();
          }
        }
      };

      // Xử lý sự kiện tăng giảm âm lượng
      volumeSlider.oninput = function () {
        audio.volume = this.value / 100;
      };
    };
  },
  start: function () {
    const savedIndex = this.configs.currentIndex;

    // Kiểm tra xem chỉ số đã được lưu trữ trong localStorage chưa
    if (
      savedIndex !== undefined &&
      savedIndex !== null &&
      savedIndex < this.songs.length
    ) {
      // Sử dụng chỉ số từ localStorage để tải bài hát
      this.currentIndex = savedIndex;
    } else {
      // Mặc định tải bài hát đầu tiên
      this.currentIndex = 0;
    }
    this.defindProperties();
    // Xử lý các sự kiện
    this.handleEvents();
    // Tải thông tin bài hát đầu tiên
    this.loadCurrentSong();
    // Render playlist
    this.render();
    // Hiển thị trang thái ban đầu của repeat
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
  formatTime: function (timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  },
};

app.start();
