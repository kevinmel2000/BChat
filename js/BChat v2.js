// !------ BChat
// !------ VERSI : 2 BETA
// !------ UPDATED: 3 OKTOBER 2016
// !------ Muhammad BayuNugraha
// !------ http://chat.bayyu.me
// !------ SILAHKAN DIKEMBANGKAN LAGI GAN.. :D

$(document).ready(function() {
  $('#masuk').on('click', function() {
    var nama = $('#ses_user').val(); // NAMA USER YANG TADI LOGIN
        var regex = new RegExp("^[a-zA-Z0-9]+$");
     if (!regex.test(nama)) { alert('Masukan Nama yang benar!!'); return false; } // KALO NAMANYA ANEH.. :3
    
    $('#welc').html('<strong>' + nama + '.</strong> <img src="https://uxcam.com/images/join-uxcam.png" class="img-circle" height="22px">');
    $('#user').val(nama);
    $('#loadmain').fadeOut('slow'); 
    Mulai_cek();
  });
});

$(window).load(function() {
    $('#loadmain').fadeIn('slow');
    $('.konten').append('<audio id="sound" hidden="true" src="sms.mp3" preload="auto">'); // !-- INI UNTUK FITUR SOUND NOTIFIKASI :v
    //loadd();  
});


var dbRef     =   new Firebase("https://baychat-548c8.firebaseio.com/"); // UBAH URL INI DENGAN AKUN FIREBASE KALIAN
var chatsRef  =   dbRef.child('bay_chat'); // NAMA DATABASE YANG INGIN DISIMPAN

function Mulai_cek() { 
chatsRef.on("child_added", function(snap) {
  console.log("added", snap.key(), snap.val());         // MENDETEKSI ADANYA DATA BARU
      $('#pesan_nya').append(Tampil_Chat(snap.val()));  // APPEND KE HTML JIKA ADA DATA BARU
      var notip = document.getElementById("sound");     // MEMAINKAN SUARA NOTIFIKASI B-)
      notip.play();

});

chatsRef.on("value", function(snapshot) {
  var jum = snapshot.numChildren();
  $('html head').find('title').text("BChat " + "(" + jum + ")"); // -- UPDATE TITLE BAR PADA BROWSER
});
}


// --- STRIP_TAGS fungsinya sama seperti strip_tags pada PHP
function strip_tags(str, allow) {
  allow = (((allow || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}

$(document).ready(function() {
  $('#welc').on('click', function() {
   $('html, body').animate({scrollTop: $(document).height()}, 600);
  });

// --- JIKA DI ENTER,, KIRIM LANGSUNG
  $('#message').keypress(function(e) {
    if (e.which == 13) {
        kirim(); // PANGGIL PROSES KIRIM UNTUK DI SAVE

    }
});
});

function kirim() {

  var a = new Date(),
      d = a.getDate(),
      y = a.getFullYear(),
      h = a.getHours(),
      m = a.getMinutes();
var bulan = new Array();
    bulan[0]  = "Jan";
    bulan[1]  = "Feb";
    bulan[2]  = "Mar";
    bulan[3]  = "Apr";
    bulan[4]  = "Mei";
    bulan[5]  = "Jun";
    bulan[6]  = "Jul";
    bulan[7]  = "Aug";
    bulan[8]  = "Sep";
    bulan[9]  = "Okt";
    bulan[10] = "Nov";
    bulan[11] = "Des";

var c     =   bulan[a.getMonth()];
var date  =   d + '/' + c + '/' + y + ' ' + h + ':' + m; // --- TANGGAL / BULAN / TAHUN + JAM : MENIT
  if ($('#user').val() != '' && $('#message').val() != '') {
    var pesan = $('#message').val();
    // PUSH DATA KE SERVER
    chatsRef
    .push({
          nama:     sensor($('#user').val()),
          pesan:    sensor(linkify(pesan)),
          alamat:   $('#alamat').val(),
          waktu:     date
    })
    
  } else {
  alert('Tolong masukan nama dan pesan..');
  }
    $('#message').val('');$('html, body').animate({scrollTop: $(document).height()}, 600);

}

// ----- UBAH KE LINK JIKA ADA PESAN DALAM BENTUK URL
function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    return replacedText;
}

//prepare conatct object's HTML
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function Tampil_Chat(chat) { // ---- PROSES MENAMPILKAN CHAT DARI SERVER..
  console.log(chat);
   var bubble   = (chat.alamat == $('#alamat').val() ? "kanan" : "kiri"); // -- JIKA ITU ANDA >> POSISI BUBBLE CHAT JADI DI KANAN.. 
   var pos      = (chat.alamat == $('#alamat').val() ? "pull-right" : "pull-left");
   var nama     = (chat.alamat == $('#alamat').val() ? '' : htmlEntities(chat.nama));
   var stat     = (chat.alamat == $('#alamat').val() ? '<i class="glyphicon glyphicon-ok" style="color:#3B9285;"></i>' : '');
    var html  = '<div class="col-md-7 col-xs-8 ' + pos + '">';
        html  += '<label class="usr">' + nama + '</label>';
        html  += '<div   class="isi_pesan ' + bubble + '">' + strip_tags(chat.pesan, '<img><br><a>') + '</div>';
        html  += '<small class="pull-right" id="waktu">' + chat.waktu + ' ' + stat + '</small>';
        html  += '</div>';
  return html;
}

// ----  :v BIAR LEBIH KEREN.. DAN TIDAK MENGGANGGU , FITUR SENSOR KATA KOTOR :v
// ----  SORRY GAK FULL GAN :v INI KAN UNTUK SHARE,, SILAHKAN DITAMBAHIN SENDIRI
function sensor(kata) {
  var text = kata;
    var array = {
            "kucing":"*meong",
            "netnot":"*tiiitt",
            "tikus" :"*mouse"
          };

    for (var val in array)
      text = text.replace(new RegExp(val, "gi"), array[val]);
    return text;
}
