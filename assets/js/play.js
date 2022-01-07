$('.list').hide();
	 var height = $('.body').height();
	 if(height < 528) {
			var offset = (height - 528) / 2 - 16;
			$('.aplayer-lrc').css("margin-top", "" + offset + "px");
	 }
	    var nSSD = new Array();
	    var nSFolder = new Array();
	    var list = "";
	    var name="";
	    var RESTART = 0;
		var nS = android.returnMUSIC_URL();
		nSSD = nS.split("/");
		name = nSSD[nSSD.length-1];
		var path = nS.replace("/" + name, "");
		var SDPath = android.getSDPath();
	    //alert(nS);
		nS = android.getFiles(path);
		nSSD = nS.split("\n");
		var patt = /.mp3$/;
		for(var i = 0; i < nSSD.length; i++) {
			if(android.isFolder(nSSD[i])) {
			}
			else {
				//music list
				if(patt.test(nSSD[i])) list += nSSD[i] + '\n';
			}
		}
			
		function getMp3List() {
			nSSD = list.split("\n");
			$('.list')[0].innerHTML = "<h3>同目录歌曲</h3>"
			for(var i = 0; i < nSSD.length - 1; i++) {
				nSFolder = nSSD[i].split("/");
				name = nSFolder[nSFolder.length-1];
			    if(i<10)
			        $('.list')[0].innerHTML += '<p id="song_id' + i +'">0' + (i+1) + ' ' + name + '</p>';
				else
				    $('.list')[0].innerHTML += '<p id="song_id' + i +'">' + (i+1) + ' ' + name + '</p>';
			}
			//android.jswrite(SDPath + '/mp3list.txt', list);	
		}
		getMp3List();
		
		$('#mp3List').click(function() {
            getMp3List();
		    $('.aplayer-lrc').toggle();
			$('.list').height($('.body').height() * 0.95);
		    $('.list').css("border", "1px solid #d9d9d9");
		    $('.list').toggle();
		});
		
		// 播放列表歌曲点击
		$('.list').on('click', 'p', function() {
			  var song_id = $(this).attr('id');
			  if(song_id !== null) {
			  		var i = parseInt(song_id.replace("song_id", ""));
			  		android.setMUSIC_URL(nSSD[i]);
			  		RESTART = 1;
			  		$('#musicPlay').click();
			  }
		});
	    $(".list").niceScroll({
        	  touchbehavior: false,
        	  cursorcolor: "#d9d9d9",
        	  cursoropacitymax: 0.8,
        	  cursorwidth: 5,           
        	  cursorborder: "none",
        	  cursorborderradius: "4px",
        	  background: "",
       	      autohidemode: true
        });
        function autoRandomPlay() {
			  var i = nSSD.length -1;
			  i = Math.floor(Math.random()*i);
			  android.setMUSIC_URL(nSSD[i]);
			  RESTART = 1;
			  $('#musicPlay').click();
		}
		
		// 音乐控件
        var audio = document.getElementsByTagName('audio')[0];
		audio.volume=0.5;
	    var myvol =  Math.round((audio.volume)*100);
		$('.vol')[0].innerText = "音量: " + myvol + "%";
		// 开启, 关闭静音
		$('#Volume').click(function() {
		      if(audio.muted) {
			        audio.muted = false;
					$('#Volume').attr('class', 'fa fa-volume-off');
			  }
			  else {
			        audio.muted = true;
					$('#Volume').attr('class', 'fa fa-volume-off');
              }
	    });
		// 音量减
		$('#volM').click(function() {
		      audio.volume -= 0.1;
			  if(audio.volume <= 0) audio.volume=0;
			  myvol =  Math.round((audio.volume)*100);
			  $('.vol')[0].innerText = "音量: " + myvol + "%";
		});
		// 音量加
		$('#volP').click(function() {
			  audio.volume += 0.1;
			  if(audio.volume >=1) audio.volume=1;
			  myvol =  Math.round((audio.volume)*100);
			  $('.vol')[0].innerText = "音量: " + myvol + "%";
	    });
	
        // 点击播放/暂停按钮时，控制音乐的播放与暂停
        $('#musicPlay').click(function () {
            // 监听音频播放时间并更新进度条
            audio.addEventListener('timeupdate', function () {
                updateProgress(audio);
            }, false);
            //监听播放完成事件
            audio.addEventListener('ended', function () {
                audioEnded();
            }, false);

			//当前选择歌曲music path
			var nS = android.returnMUSIC_URL();
            var nSTemp = nS;
			nS = encodeURI("file://" + nS);
			//没有播放过歌曲play
			if (audio.src === "") {
				  if (nS !== "file://") {
			            audio.src = nS;
			            audio.play();
				        $('#musicPlay').attr('class', 'fa fa-pause-circle');
               	        getNAME(nSTemp);
				  }
			}
			//播放过歌曲并重新选择了文件play another
			else if (audio.src !== "" && audio.src !== nS) {
				  audio.src = nS;
				  audio.play();
				  $('#musicPlay').attr('class', 'fa fa-pause-circle');
				  getNAME(nSTemp);
			}
			//播放或暂停当前歌曲play or pause
			else if (audio.src !== "" && audio.src === nS) {
				  if(RESTART === 0) {
			            if (audio.paused) {
				              audio.play();
				              $('#musicPlay').attr('class', 'fa fa-pause-circle');
                         }
				         else {
						      audio.pause();
						      $('#musicPlay').attr('class', 'fa fa-play-circle');
				         }
				  }
				  //重新播放replay
				  else {
					    audio.currentTime = 0;
					    audio.play();
				        $('#musicPlay').attr('class', 'fa fa-pause-circle');
				  }
            }
			lrc_url = nS.replace(".mp3", ".lrc");
			getLRC();
			RESTART = 0;
        });
		$('#musicPlay').click();
        function showPlayIcon() {
			$('#musicPlay').attr('class', 'fa fa-play-circle');
		}
    /* 根据音乐路径提取歌名并显示 */
    function getNAME(music_url) {
           var name;
           name = music_url.split("/");
           $("#music_name")[0].innerText = name[name.length-1];
    }

        // 点击进度条跳到指定点播放
        // PS：此处不要用click，否则下面的拖动进度点事件有可能在此处触发，此时e.offsetX的值非常小，会导致进度条弹回开始处（简直不能忍！！）
        $('#progressBarBg').on('mousedown', function (e) {
            // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            if (!audio.paused || audio.currentTime != 0) {
                var pgsWidth = $('.progress-bar-bg').width();
                var rate = e.offsetX / pgsWidth;
                audio.currentTime = audio.duration * rate;
                updateProgress(audio);
            }
        });
        dragProgressDotEvent(audio);
	
    /**
     * 鼠标拖动进度点时可以调节进度
     * @param {*} audio
     */
    function dragProgressDotEvent(audio) {
        var dot = document.getElementById('progressDot');

        var position = {
            oriOffestLeft: 0, // 移动开始时进度条的点距离进度条的偏移值
            oriX: 0, // 移动开始时的x坐标
            maxLeft: 0, // 向左最大可拖动距离
            maxRight: 0 // 向右最大可拖动距离
        };
        var flag = false; // 标记是否拖动开始

        // 鼠标按下时
        dot.addEventListener('mousedown', down, false);
        dot.addEventListener('touchstart', down, false);

        // 开始拖动
        document.addEventListener('mousemove', move, false);
        document.addEventListener('touchmove', move, false);

        // 拖动结束
        document.addEventListener('mouseup', end, false);
        document.addEventListener('touchend', end, false);

        function down(event) {
            if (!audio.paused || audio.currentTime != 0) { // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
                flag = true;

                position.oriOffestLeft = dot.offsetLeft;
                position.oriX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousedown和touchstart事件
                position.maxLeft = position.oriOffestLeft; // 向左最大可拖动距离
                position.maxRight = document.getElementById('progressBarBg').offsetWidth - position.oriOffestLeft; // 向右最大可拖动距离

                // 禁止默认事件（避免鼠标拖拽进度点的时候选中文字）
                if (event && event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }

                // 禁止事件冒泡
                if (event && event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    window.event.cancelBubble = true;
                }
            }
        }

        function move(event) {
            if (flag) {
                var clientX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousemove和touchmove事件
                var length = clientX - position.oriX;
                if (length > position.maxRight) {
                    length = position.maxRight;
                } else if (length < -position.maxLeft) {
                    length = -position.maxLeft;
                }
                var pgsWidth = $('.progress-bar-bg').width();
                var rate = (position.oriOffestLeft + length) / pgsWidth;
                audio.currentTime = audio.duration * rate;
                updateProgress(audio);
            }
        }

        function end() {
            flag = false;
        }
    }

    /**
     * 更新进度条与当前播放时间
     * @param {object} audio - audio对象
     */
    function updateProgress(audio) {
        var value = audio.currentTime / audio.duration;
        $('#progressBar').css('width', value * 100 + '%');
        $('#progressDot').css('left', value * 100 + '%');
        $('#audioCurTime').html(transTime(audio.currentTime));
        $('.audio-length-total').text(transTime(audio.duration));
        console.log(audio)
    }

    /**
     * auto random replay
     */
    function audioEnded() {
        $('#progressBar').css('width', 0);
        $('#progressDot').css('left', 0);
        $('#audioCurTime').html(transTime(0));
        $('#musicPlay').attr('class', 'fa  fa-play-circle');
		autoRandomPlay();
    }

    /**
     * 音频播放时间换算
     * @param {number} value - 音频当前播放时间，单位秒
     */
    function transTime(value) {
        var time = "";
        var h = parseInt(value / 3600);
        value %= 3600;
        var m = parseInt(value / 60);
        var s = parseInt(value % 60);
        if (h > 0) {
            time = formatTime(h + ":" + m + ":" + s);
        } else {
            time = formatTime(m + ":" + s);
        }

        return time;
    }

    /**
     * 格式化时间显示，补零对齐
     * eg：2:4  -->  02:04
     * @param {string} value - 形如 h:m:s 的字符串
     */
    function formatTime(value) {
        var time = "";
        var s = value.split(':');
        var i = 0;
        for (; i < s.length - 1; i++) {
            time += s[i].length == 1 ? ("0" + s[i]) : s[i];
            time += ":";
        }
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        return time;
    }
	
	$('#openFile').click(function() {
		android.gotoActivity("joesky.mp.file");
	});
	$('#Help').click(function() {
		android.gotoActivity("joesky.mp.wel");
	});
