
// detect if flash is installed.
function hasFlash() {
  if (hasFlash.__hasFlashInstalled !== (void 0) &&
  hasFlash.__hasFlashInstalled !== null) {
    return hasFlash.__hasFlashInstalled;
  }

  var hasFlash_ = false;
  try {
    var fo = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    if (fo) {
      hasFlash_ = true;
    }
  } catch (e) {
    if (navigator.mimeTypes
      && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
      && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
      hasFlash_ = true;
    }
  }

  hasFlash.__hasFlashInstalled = hasFlash_;
  return hasFlash_;
}

(function () {
  var plupload = window.plupload;

  if (!hasFlash()) {
    alert("no flash, please install flash first");
    return;
  }

  var uploader = new plupload.Uploader({
    runtimes: 'html5, flash, html4',
    browse_button: 'browse',
    url: '/upload',
    flash_swf_url: '/static/node_modules/plupload/js/Moxie.swf',

    filters: {
      max_file_size: '10mb',
      mime_types: [
        { title: "Image files", extensions: 'jpg,gif,png' },
        { title: "Zip files", extensions: "zip" },
        { title: "Document files", extensions: "pdf,txt" }
      ]
    },

    init: {
      PostInit: function () {
        document.getElementById("filelist").innerHTML = "";
      }
    }
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
    document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message + "<br />";
  })

  document.getElementById('start-upload').onclick = function () {
    uploader.start();
    return false;
  }
}).call(this);
