(function () {
  var plupload = window.plupload;

  var uploader = new plupload.Uploader({
    browse_button: 'browse',
    url: '/upload'
  })

  uploader.init();

  uploader.bind('FilesAdded', function (up, files) {
    var html = '';
    plupload.each(files, function (file) {
      html += '<li id="' + file.id + '">' +
        file.name +
        ' (' + plupload.formatSize(file.size) + ') <b></b></li>';
    });
    document.getElementById('filelist').innerHTML += html;
  })

  uploader.bind('UploadProgress', function (up, file) {
    console.log(file.percent);
    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + '%</span>';
  })

  uploader.bind('Error', function (up, err) {
    document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
  })

  document.getElementById('start-upload').onclick = function () {
    uploader.start();
  }
}).call(this);
