var inputReady=!0,input=$(".404-input");function resetForm(t){var p="Sorry that command is not recognized.",o=$(".404-input");t&&($(".kittens").removeClass("kittens"),p="Huzzzzzah Kittehs!"),$(".new-output").removeClass("new-output"),o.val(""),$(".terminal").append('<p class="prompt">'+p+'</p><p class="prompt output new-output"></p>'),$(".new-output").velocity("scroll")}function showKittens(){$(".terminal").append("<div class='kittens'><p class='prompt'>\t                             ,----,         ,----,                                          ,---,</p><p class='prompt'>       ,--.                ,/   .`|       ,/   .`|                     ,--.              ,`--.' |</p><p class='prompt'>   ,--/  /|    ,---,     ,`   .'  :     ,`   .'  :     ,---,.        ,--.'|   .--.--.    |   :  :</p><p class='prompt'>,---,': / ' ,`--.' |   ;    ;     /   ;    ;     /   ,'  .' |    ,--,:  : |  /  /    '.  '   '  ;</p><p class='prompt'>:   : '/ /  |   :  : .'___,/    ,'  .'___,/    ,'  ,---.'   | ,`--.'`|  ' : |  :  /`. /  |   |  |</p><p class='prompt'>|   '   ,   :   |  ' |    :     |   |    :     |   |   |   .' |   :  :  | | ;  |  |--`   '   :  ;</p><p class='prompt'>'   |  /    |   :  | ;    |.';  ;   ;    |.';  ;   :   :  |-, :   |   \\ | : |  :  ;_     |   |  '</p><p class='prompt'>|   ;  ;    '   '  ; `----'  |  |   `----'  |  |   :   |  ;/| |   : '  '; |  \\  \\    `.  '   :  |</p><p class='prompt'>:   '   \\   |   |  |     '   :  ;       '   :  ;   |   :   .' '   ' ;.    ;   `----.   \\ ;   |  ;</p><p class='prompt'>'   : |.  \\ |   |  '     '   :  |       '   :  |   '   :  ;/| '   : |  ; .'  /  /`--'  /  `--..`;  </p><p class='prompt'>|   | '_\\.' '   :  |     ;   |.'        ;   |.'    |   |    \\ |   | '`--'   '--'.     /  .--,_   </p><p class='prompt'>'   : |     ;   |.'      '---'          '---'      |   :   .' '   : |         `--'---'   |    |`.  </p><p class='prompt'>;   |,'     '---'                                  |   | ,'   ;   |.'                    `-- -`, ; </p><p class='prompt'>'---'                                              `----'     '---'                        '---`'</p><p class='prompt'>                                                              </p></div>");var t=$(".kittens p");$.each(t,function(t,p){setTimeout(function(){$(p).css({opacity:1}),textEffect($(p))},100*t)}),$(".new-output").velocity("scroll"),setTimeout(function(){var t;$.get("https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=kittens",function(p){t=p.data.image_url,$(".terminal").append('<img class="kitten-gif" src="'+t+'"">'),resetForm(!0)})},100*t.length+1e3)}function textEffect(t){var p=[";",".",",",":",";","~","`"],o=0,n=t.text().split(""),e=n.slice(0),s=e.map(function(t){return[p[Math.floor(Math.random()*p.length)],o++]});s=shuffle(s),$.each(e,function(p,o){var r=s[p];toUnderscore(e,t,r),setTimeout(function(){fromUnderscore(e,n,r,t)},10*p)})}function toUnderscore(t,p,o){t[o[1]]=o[0],p.text(t.join(""))}function fromUnderscore(t,p,o,n){t[o[1]]=p[o[1]],n.text(t.join(""))}function shuffle(t){for(var p,o,n=t.length;n;p=Math.floor(Math.random()*n),o=t[--n],t[n]=t[p],t[p]=o);return t}input.focus(),$(".container").on("click",function(t){input.focus()}),input.on("keyup",function(t){$(".new-output").text(input.val())}),$(".four-oh-four-form").on("submit",function(t){t.preventDefault(),"kittens"===$(this).children($(".404-input")).val().toLowerCase()?showKittens():resetForm()});