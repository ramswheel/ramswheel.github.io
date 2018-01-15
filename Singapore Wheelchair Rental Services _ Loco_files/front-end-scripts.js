(function($){'use strict';$(document).ready(function(){function open_links_in_popup(){var newwindow='';$('a[data-class="popup"]').on('click',function(e){e.preventDefault();newwindow=window.open($(this).attr('href'),'','height=270,width=500');if(window.focus){newwindow.focus()}
return false;});}
open_links_in_popup();});})(window.jQuery);