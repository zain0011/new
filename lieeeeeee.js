$(function() {
  $('.public_image').change(function() {
    if (user.likes < site_data.wall_likes) {
      fireNotification({msg: 'لاااااايكااااااااااااااااااات ' + site_data.wall_likes + 'إعجاب'});
      return true;
    }
    // if (user.likes < site_data.upload_likes) {
      //     fireNotification({msg: 'إرسال الملفات يتطلب منك الحصول على ' + site_data.upload_likes + 'إعجاب'});
      //     return true;
      // }
      if (user.last_post == undefined || user.last_post == 0) {
        user.last_post = 1;
        $('.public_type').val($('.public_image').attr('file_type'));
        var form = $(".public_from");
        var formData = new FormData(form[0]);
        $('.public_image').val('');
        $('.public_type').val('');
        $.ajax({
          xhr: function() {
            console.log('upload');
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
              if (evt.lengthComputable) {
                var percentComplete =parseInt(evt.loaded / evt.total * 100);
                //Do something with upload progress
                $('.update-status').html('%'+percentComplete);
              }
            }, true);
            return xhr;
          },
          beforeSend: function() {
            var progress_bar = '<p>' + fileName + '</p>';
            $('.update-bar').css('display','flex');
            $('.update-name').append(progress_bar);
          },
          url: form.attr('action'),
          type: 'POST',
          data: formData,
          async: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
          },
          success: function(data) {
            if (data.status == 1) {
              socket.emit('publicMsg', data);
            }
          },
          error: function(data) {
            // console.log('ERRORS: ' + JSON.stringify(data));
          },
          // complete: function(){
          //   $('.update-bar').css('display','true');
          //   $('.update-name').empty();
          // },
          crossDomain: true,
          cache: true,
          contentType: true,
          processData: true
        });
        setTimeout(function() {
          user.last_post = 0;
        }, site_data.wall_minutes * 60 * 1000);
      }
    });

    // submit public wall form
    $('.public_from').submit(function(e) {
      e.preventDefault();
      if ($('.public_message').val() == "") {
        return true;
      }
      if (user.likes < site_data.wall_likes) {
        $('.public_message').val('');
        fireNotification({msg: 'االاااااااايكااااااااتتتتتتتت' + site_data.wall_likes + 'إعجاب'});
        return true;
      }
      if (user.last_post == undefined || user.last_post == 0) {
        user.last_post =  (user.group_id != 2 || user.type == 'admin')? 0 : 1;
        var data = {
          post: $('.public_message').val().substring(0,300),
          type: ''
        }
        $.post(base_url + '/public_post', data, function(response) {
          if (response.status == 0) {
            alert("عفوا تستخدم كلمات محظورة");
          } else {
            socket.emit('publicMsg', response, function(response) {});
          }
          $('.public_image').val('');
          $('.public_message').val('');
          $('.public_type').val('');
        });
        if ((user.last_post == 1)) {
          setTimeout(function() {
            user.last_post = 0;
          }, site_data.wall_minutes * 60 * 1000);
        }
      }else {
        if (site_data.wall_minutes > 0) {
          fireNotification({msg: 'الكتابة في الحائط كل' + site_data.wall_minutes + 'دقيقة'});
        }
      }

    });

    function submitWall() {
      var form = $(".public_from");
      if ($('.public_image').val() == "" && $('.public_message').val() == "") {
        return true;
      }
      var formData = new FormData(form[0]);
      $.ajax({
        url: form.attr('action'),
        type: 'POST',
        data: formData,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
        },
        success: function(data) {
          if (data.status == 1) {
            socket.emit('publicMsg', data);
            $('.public_image').val('');
            $('.public_message').val('');
            $('.public_type').val('');
          }
        },
        error: function(data) {
          // console.log('ERRORS: ' + JSON.stringify(data));
        },
        crossDomain: true,
        cache: true,
        contentType: true,
        processData: true
      });
    }

    socket.on('removePostUI', function(data) {
      $('.post-' + data.id).remove()
    });

    socket.on('appendWall', function(data) {
      $('.public_wall').animate({
        scrollTop: $('.public_wall').offset().top - 50//#DIV_ID is an example. Use the id of your destination on the page
    }, 'fast');
      var d = new Date();
      var n = d.getTime();
      if ($('#public').hasClass('slideshow') == true) {
        wall_count += 1;
        $('span.new_posts').html(wall_count);
        $('.wall_a').attr('style', 'background-color:#f0ad4e!important;');
      }
      if (data.status == 0) {
        alert(data.msg);
      } else {
        var wall_posts_length = $(".public_wall").children().length;
        if (wall_posts_length > 20) {
          $(".public_wall").children().last().remove();
        }
        var username = (data.user.fake_name == "") ? data.user.username : data.user.fake_name;
        var image = (data.user.image == "") ? "/images/site/" + site_data.image : "/images/users/" + data.user.image;
        var gift = (data.user.gift == "") ? "" : '<img class="fl u-ico" src="' + base_url + "/images/gifts/" + data.user.gift + '">';
        if (data.user.group == undefined || data.user.group == "") {
          data.user.group = groups.find(group => group.id == data.user.group_id);
        }
        var group_icon = (data.user.group.image == "") ? "" : '<span><img class="fl u-ico" src="' + base_url + '/images/gifts/' + data.user.group.image + '"></span>';
        var icon = (data.user.group_id == 2) ? gift : group_icon;
        var msg = "";
        if (data.post.type == "image") {
          msg = "<button onclick='fileBtn(" + data.post.id + ")' file-id=" + data.post.id + " class='btn-file-" + data.post.id + " btn fa fa-image'>عرض الصوره</button> <a href='" + base_url + "/images/wall/" + data.post.image + "' target='_blank' > <img style='display:true;max-width: 200px;max-height: 200px;' class='img-responsive post-" + data.post.id + "' src='" + base_url + "/images/wall/" + data.post.image + "'></a>";
        } else if (data.post.type == "video") {
          msg = "<button onclick='fileBtn(" + data.post.id + ")' file-id=" + data.post.id + " class='btn-file-" + data.post.id + " btn fa fa-youtube-play'>عرض الفيديو</button> <video class='post-" + data.post.id + "' style='display:true; width:90%;max-height: 200px;' controls><source src='" + base_url + "/images/wall/" + data.post.image + "' type='video/mp4'></video>";
        } else if (data.post.type == "audio") {
          msg = "<button onclick='fileBtn(" + data.post.id + ")' file-id=" + data.post.id + " class='btn-file-" + data.post.id + " btn fa fa-youtube-play'>مقطع الصوت</button><audio class='post-" + data.post.id + "' style='display:true; width: 90%; width:200px;' controls><source src='" + base_url + "/images/wall/" + data.post.image + "' type='audio/mpeg'></audio>";
        } else if (data.post.type == "youtube") {
          msg = "<button  onclick='videoBtn($(this))' video-id='" + data.post.post + "' file-id='" + data.post.id + "' style='padding-right:75px;max-width: 200px;' class='btn-file-" + data.post.id + " youtube-btn btn fa fa-youtube'>" +
          "<img src='https://img.youtube.com/vi/" + data.post.post + "/0.jpg' alt='[youtube]' style='width:80px;'/>" +
          "</button>" +
          "<iframe style='width: 99%;height: 205px;display:true;max-width: 240px;' class='post-" + data.post.id + "'></iframe>";
        } else {
          msg = data.post.post + '<br>' + msg;
        }

        if (msg != "") {

          var likes = (data.post.likes == 0) ? '' : data.post.likes;
          var unique = Date.parse(parseDate(data.post.created_at)) + "_public";

          var final = '<li class="single-chat-line post-li text-left post-' + data.post.id + '" user-id="'+data.post.user_id+'" style="border-bottom: 2px; margin-bottom:0px;padding:0;"><div style="border: 1px solid #cacaca; width: 36px; height: 38px; margin-left: 1px; margin-top: 1px; " class="user-avatar pull-left"><a class="single-user-panel" visitor_id="' + data.post.user_id + '"><img src="' + image + '" alt="' + username + '" class="userIMG"></a></div>';
          var display = (user.type == "admin" || user.group.delete_wall == 1 || user.id == data.post.user_id) ? 'display:block' : 'display:true';
          final += '<button onclick="deletePost(' + data.post.id + ')" class="btn btn-primary pull-right fa fa-close delete_wall" style="' + display + '"></button>';
          final += '<h5 class="single-user-panel" visitor_id="' + data.user_id + '">' + icon + '<span class="dots"  style="padding: 2px 8px 0px 8px;margin-top: 1px; border-radius: 3px;max-width: 60%;color:' + data.user.name_color + ';background-color:' + data.user.name_background + ';">' + username + '</span>' +
          '<span style="margin-top:2px;padding:0px 2px;margin-left:-20px;margin-right:4px;color:grey" class="fr minix tago" ago="' + n + '">الآن</span>' +
          '</h5><p style="width: 90%;padding-left: 40px;word-wrap: break-word;margin-bottom: 0;font-size:.8rem;color:' + data.user.font_color + '">' + msg + '</p><button onclick="likePost(' + data.post.id + ')" class="btn pull-right fa fa-heart" style="background: #c12e2a;color:white;padding: 0.3rem;font-size: 0.9rem !important;"><span class="post-likes-' + data.post.id + '">' + likes + '</span></button></li>';
          $('.public_wall').prepend(final);
        }

      }
    });

  });
