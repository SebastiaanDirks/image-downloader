var player_ids = {};
var player_count = 0;

$(function() {
    var options = {
        url: "players.json",

        listLocation: "Players",
        getValue: function(element) {
            if (element.c != null) {
                return element.c;
            }
            else {
                return element.l;
            }
        },

        list: {
            match: {
                enabled: true
            },
            onClickEvent: function() {
                var data = $("#player-autocomplete").getSelectedItemData();
                var times = $("#card-amount").val() || 1;
                if (times < 1 || times > 50) {
                    times = 1;
                }
                var id = data.id;

                var final = 50331648 + (16777216 * (times - 1)) + id;
                $("#base-id").val(id);
                $("#final-id").val(final);
            }
        },
        template: {
            type: "custom",
            method: function(value, item) {
                var name = item.f + " " + item.l;
                if (name.length > 18) {
                    if (item.c != null) {
                        return item.c + "<rating style='float: right;'>" + item.r + "</rating>";
                    }
                    else {
                        return value + "<rating style='float: right;'>" + item.r + "</rating>";
                    }
                }
                return item.f + " " + value + "<rating style='float: right;'>" + item.r + "</rating>";
            }
        }
    };
    $("#player-autocomplete").easyAutocomplete(options);

});

$(document).ready(function() {
    $("#card-amount").change(function() {
        var value = $("#card-amount").val();
        var baseId = $("#base-id").val();
        if (baseId == "" || baseId == null) {
            return;
        }
        baseId = parseInt(baseId);
        var final = 50331648 + (16777216 * (value - 1)) + baseId;
        $("#final-id").val(final);
    });

    $("#add-player").click(function() {
        var id = $("#final-id").val();
        var baseId = $("#base-id").val();
        var name = $("#player-autocomplete").val();
        var amount = $("#card-amount").val();
        var link = "https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/playerheads/html5/single/512x512/p";
        if (baseId == "" || baseId == null) {
            return;
        }
        baseId = parseInt(baseId);
        player_ids['key_' + player_count] = id;
        $("#added-players").html($("#added-players").html() + '<div class="col-md-3" id="count_' + player_count + '"><div class="panel panel-primary"><div class="panel-heading"><button type="button" class="close" id="close_' + player_count + '" onclick="removePlayer(' + player_count + ');" card-id="' + player_count + '" aria-label="Close"><span aria-hidden="true" class="">&times;</span></button><h3 class="panel-title">' + name + '</h3></div><div class="panel-body"><span><b>ID: </b>' + id + '</span><br><span><b>Base ID: </b>' + baseId + '</span><br><span><b>Image: </b><a href="' + link + id + '.png" target="_blank">Link</a></span><br></div></div></div>');
        player_count++;
    });

    $("#link-image").click(function() {
        var link = "https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/playerheads/html5/single/512x512/p";
        var id = $("#final-id").val();
        if (id == "" || id == null) {
            return;
        }
        var win = window.open(link + id + ".png", '_blank');
        win.focus();
    });

});

function removePlayer(card_id) {
    player_ids['key_' + card_id] = null;
    player_count--;
    $("#count_" + card_id).remove();
}

function downloadPlayers() {
    if (player_ids.length <= 0) {
        return;
    }
    var zip = new JSZip();
    var a = document.querySelector("a");
    var urls = $.map(player_ids, function(value, index) {
        return [value];
    });

    function request(url, name) {
        return new Promise(function(resolve) {
            JSZipUtils.getBinaryContent(url, function(err, data){
                if (err) {
                    throw err;
                }
                zip.file(name, data, {binary:true});
                resolve();
            });
        })
    }

    Promise.all(urls.map(function(url) {
            //Old link
            var link = "https://fifarenderz.com/php/download.php?id=";
            if (url == null) return;
            return request(link + url, "p" + url + ".png")
        }))
        .then(function() {
            console.log(zip);
            zip.generateAsync({
                    type: "blob"
                })
                .then(function(content) {
                    a.download = "download_" + new Date().getTime();
                    a.href = URL.createObjectURL(content);
                    a.innerHTML = "download " + a.download;
                    a.click();
                });
        })
}
