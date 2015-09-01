;(function ( $, window, document, undefined ) {
		var pluginName = "blockbox";
		var defaults = {
    		id: null,
            url: false,
            iterator: 0,
            gridster: null,
            preview: false,
            mail: false
		};
        var gridster = null;

        
		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.settings.iterator++;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
			init: function () {
				globalUrlPrefix 	= this.settings.urlprefix;
                this.settings.id 	= $(this.element).attr("id");                
                this.drawContainer();
                this.initGridster();
                this.drawModals(this.settings.blockbox);
                this.loadBlocks(this.settings.data, this.settings.blockbox);
		    },

            initGridster: function () {
                var e = this;

                this.gridster = $(".gridster ul").gridster({
	                
                    widget_base_dimensions: this.settings.base_dimensions,
                    resize: {
                        enabled: true,
                        max_size: this.settings.max_size,
                        min_size: this.settings.min_size
                    },
                                    'widget_margins': [0,0],
                    serialize_params: function($w, wgd) { 
                        return {
                            id: $w.prop('id'),
                            col: wgd.col,
                            row: wgd.row,
                            size_x: wgd.size_x,
                            size_y: wgd.size_y,
                            position: wgd.col + '|' + wgd.row + '|' + wgd.size_x + '|' + wgd.size_y,
                        };
                    }

                }).data('gridster');
            },
		    
		    drawContainer: function() {
                               
                var e = this;
               
                var title = e.settings.title;
				
                var section = $("<section>").addClass("elementPanel").appendTo(this.element);
                var header = $("<div class=\"title\"><h3>" + title + "</h3></div>").appendTo(section);
                var content = $("<div>").addClass("content").appendTo(section);

                var ultab = $("<ul>").addClass("tabs buttonWrapper").attr("data-tab", "data-tab").attr("role", "tablist").appendTo(content);

				var li_edit = $("<li>").addClass("left").appendTo(ultab);
				var a_edit = $("<a>").addClass("button radius secondary small").attr("id", "editorcontent").attr("href", "#edit").attr("role", "tab").attr("tabindex", "0").attr("aria-selected", "true").attr("aria-controls", "edit").html(" Edit").on("click", function () {
					e.loadEdit();
						
				}).appendTo(li_edit);
				var i_edit = $("<i>").addClass("fa fa-pencil-square-o").prependTo(a_edit);
				
				if (e.settings.preview == true) {
					var li_preview = $("<li>").addClass("left").appendTo(ultab);
					var a_preview = $("<a>").addClass("button radius secondary small").attr("id", "previewcontent").attr("href", "#preview").attr("role", "tab").attr("tabindex", "1").attr("aria-selected", "false").attr("aria-controls", "preview").html(" Preview").on("click", function () {
						e.loadPreview();							
					}).appendTo(li_preview);
					var i_preview = $("<i>").addClass("fa fa-eye").prependTo(a_preview);
				}
				
				if (e.settings.mail == true) {
					var li_mail = $("<li>").addClass("left").appendTo(ultab);
					var a_mail = $("<a>").addClass("button radius secondary small").attr("id", "mailcontent").attr("href", "#mail").attr("role", "tab").attr("tabindex", "2").attr("aria-selected", "false").attr("aria-controls", "mail").html(" E-Mail").on("click", function () {
						e.loadMail();
							
					}).appendTo(li_mail);
					var i_mail = $("<i>").addClass("fa fa-envelope-o").prependTo(a_mail);
				}
				
				var li_save = $("<li>").addClass("right").appendTo(ultab);
				var a_save = $("<a>").addClass("button small primary radius").attr("id", "savecontent").attr("aria-controls", "save").html(" Save").on("click", function () {
						e.save();
					}).appendTo(li_save);
				var i_save = $("<i>").addClass("fa fa-floppy-o").prependTo(a_save);
				
				
                var contenttab = $("<div>").addClass("tabs-content").appendTo(content);
                var sectiontab = $("<section>").addClass("content active").attr("id", "edit").attr("role", "tabpanel").attr("aria-hidden", "false").appendTo(contenttab);
                var div_newsletterWrapper = $("<div>").addClass("newsletterWrapper").appendTo(sectiontab);
                var div_contentblockContainer = $("<div>").addClass("contentblockContainer").attr("style", "width: 650px").appendTo(div_newsletterWrapper);
                var div_inner = $("<div>").addClass("inner").appendTo(div_contentblockContainer);
				
				var div_actionWrapper = $("<div>").addClass("actionWrapper").appendTo(div_inner);
				var div_addBlock = $("<div>").addClass("addBlock").appendTo(div_actionWrapper);
				var a_addBlock = $("<a>").addClass("md-trigger").attr("id", "addBlock").attr("data-modal", "addBlockModal").appendTo(div_addBlock);
				var i_addBlock = $("<i>").addClass("fa fa-plus").prependTo(a_addBlock);
				
				var div_gridster = $("<div>").addClass("gridster").appendTo(div_inner);
				var ul_contentBlock = $("<ul>").addClass("contentBlock").attr("style", "width: 650px; background-color: "+this.settings.background_color).appendTo(div_gridster);
				
				if (e.settings.preview == true) {
					var sectiontab_preview = $("<section>").addClass("content").attr("role", "tabpanel").attr("aria-hidden", "true").attr("id", "preview").appendTo(contenttab);
					var spantab_preview = $("<span>").addClass("right").html(" Refresh").on("click", function () {
							e.reloadPreview();
						}).appendTo(sectiontab_preview);
					var itab_preview = $("<i>").addClass("fa fa-refresh").prependTo(spantab_preview);
					var iframe_preview = $("<iframe>").attr("src", globalUrlPrefix+"/preview?id="+e.settings.blockbox).attr("id", "previewIFrame").attr("frameborder", "0").attr("width", "650px").attr("height", "1000").appendTo(sectiontab_preview);
				}
				
				if (e.settings.mail == true) {
					var sectiontab_mail = $("<section>").addClass("content").attr("role", "tabpanel").attr("aria-hidden", "true").attr("id", "mail").appendTo(contenttab);
					var spantab_mail = $("<span>").addClass("right").html(" Refresh").on("click", function () {
							e.reloadMail();
						}).appendTo(sectiontab_mail);
					var itab_mail = $("<i>").addClass("fa fa-refresh").prependTo(spantab_mail);
					var iframe_mail = $("<iframe>").attr("src", globalUrlPrefix+"/email?id="+e.settings.blockbox).attr("id", "mailIFrame").attr("frameborder", "0").attr("width", "650px").attr("height", "1000").appendTo(sectiontab_mail);
				}
				
				
				var section_widgetsettings = $("<section>").addClass("elementPanel widgetSettings collapsable").appendTo($(this.settings.blockboxsettings));
				var title_widgetsettings = $("<div>").addClass("title").on("click", function(){
					$( this ).parent().find(".content").slideToggle(700, "easeOutBounce");
				}).appendTo(section_widgetsettings);
				var h3_widgetsettings = $("<h3>").addClass("left").html("Widget settings").appendTo(title_widgetsettings);
				var span_widgetsettings = $("<span>").addClass("collapse-icon right").appendTo(title_widgetsettings);
				
				var settingcontainer_widgetsettings = $("<div>").addClass("content").attr("id", "settingContainer").appendTo(section_widgetsettings);
				var widgetsettingcontent_widgetsettings = $("<div>").addClass("bodyText").attr("id", "widgetSettingContent").html("No Block selected").appendTo(settingcontainer_widgetsettings);
				var footer_widgetsettings = $("<div>").addClass("footer nobg").appendTo(settingcontainer_widgetsettings);
				var cancelfooter_widgetsettings = $("<a>").addClass("button small inactive remove right").html("Cancel").on("click", function(){
					e.cancelEdit();
				}).appendTo(footer_widgetsettings);
				var savefooter_widgetsettings = $("<button>").addClass("button small primary left radius").attr("type", "submit").html("Save").on("click", function(){
					e.saveEdit(); 
				}).appendTo(footer_widgetsettings);
				
				
				var section_mailsettings = $("<section>").addClass("elementPanel mailSettings collapsable").appendTo($(this.settings.blockboxsettings));
				var title_mailsettings = $("<div>").addClass("title").on("click", function(){
					$( this ).parent().find(".content").slideToggle(700, "easeOutBounce");
				}).appendTo(section_mailsettings);
				var h3_mailsettings = $("<h3>").addClass("left").html("E-Mail preview").appendTo(title_mailsettings);
				var span_mailsettings = $("<span>").addClass("collapse-icon right").appendTo(title_mailsettings);
				
				var emailcontainer_mailsettings = $("<div>").addClass("content").attr("id", "emailContainer").appendTo(section_mailsettings);
				var widgetmailcontent_mailsettings = $("<div>").addClass("bodyText").attr("id", "widgetMailContent").appendTo(emailcontainer_mailsettings);
				var label_mailsettings = $("<label>").html("E-Mail").appendTo(widgetmailcontent_mailsettings);
				var input_mailsettings = $("<input>").attr("name", "emailaddress").attr("id", "emailaddress").attr("type", "text").attr("value", "").appendTo(widgetmailcontent_mailsettings);
				
				var footer_mailsettings = $("<div>").addClass("footer nobg").appendTo(emailcontainer_mailsettings);
				var sendfooter_mailsettings = $("<button>").addClass("button small primary left radius").html("Send").on("click", function(){
					e.sendMail();
				}).appendTo(footer_mailsettings);
				

                var modalContainer = $("" +
                "<div class=\"md-modal md-effect-2 addBlockModal\" id=\"addBlockModal\">" +
                "    <div class=\"md-content\">" +
                "			 <i class='fa fa-times right' id='closeButton' style='margin: 4px;'></i> " +
                "        <h1 class='row text-center'>Insert a new content block</h1>" +
                "        <div class=\"inner\">" +
                "            <ul class=\"actionList\"></ul> " +
                "        </div>" +
                "    </div>" +
                "</div>").appendTo(this.element);

                $("#addBlock").on("click", function () {
                     $( ".addBlockModal" ).addClass("md-show");
                });
                
                $("#closeButton").on("click", function () {
                	$( ".addBlockModal" ).removeClass('md-show');
				 });
            },
            
            loadEdit: function(){
	           	$("#preview").attr("aria-hidden", "true").removeClass("active");
				$("#mail").attr("aria-hidden", "true").removeClass("active");
				$("#edit").attr("aria-hidden", "false").addClass("active");
				
				$( ".elementPanel.collapsable.widgetSettings" ).find(".content").slideUp(700, "easeOutBounce");
				$( ".elementPanel.collapsable.generalSettings" ).find(".content").slideDown(700, "easeOutBounce");
				$( ".elementPanel.collapsable.mailSettings" ).find(".content").slideUp(700, "easeOutBounce");
            },
            
            saveEdit: function(){
	            $("#settingForm").submit();
				$(".elementPanel.collapsable.widgetSettings").find(".content").slideToggle(700, "easeOutBounce"); 
            },
            
            cancelEdit: function(){
	        	$(".elementPanel.collapsable.widgetSettings").find(".content").slideToggle(700, "easeOutBounce");
            },
            
            loadPreview: function(){
	            var blockbox = globalBlockBox;
	            
	            $("#mail").attr("aria-hidden", "true").removeClass("active");
				$("#edit").attr("aria-hidden", "true").removeClass("active");
				$("#preview").attr("aria-hidden", "false").addClass("active");
				
				$( ".elementPanel.collapsable.widgetSettings" ).find(".content").slideUp(700, "easeOutBounce");
			    $( ".elementPanel.collapsable.generalSettings" ).find(".content").slideUp(700, "easeOutBounce");
			    $( ".elementPanel.collapsable.mailSettings" ).find(".content").slideUp(700, "easeOutBounce");
			    
			    $("#iframe").attr("src", globalUrlPrefix+"/preview/"+blockbox);
            },
            
            reloadPreview: function(){
	            $('#previewIFrame').attr("src", $('#previewIFrame').attr('src'));
			    $("#previewIFrame").load(function() {
			        $(this).height( $(this).contents().find("preview").height() );
			    });
            },
            
            loadMail: function(){
	            var blockbox = globalBlockBox;

				$("#preview").attr("aria-hidden", "true").removeClass("active");
				$("#edit").attr("aria-hidden", "true").removeClass("active");
				$("#mail").attr("aria-hidden", "false").addClass("active");
				
				$( ".elementPanel.collapsable.widgetSettings" ).find(".content").slideUp(700, "easeOutBounce");
			    $( ".elementPanel.collapsable.generalSettings" ).find(".content").slideUp(700, "easeOutBounce");
			    $( ".elementPanel.collapsable.mailSettings" ).find(".content").slideDown(700, "easeOutBounce");
			    
				$("#iframe").attr("src", globalUrlPrefix+"/mail/"+blockbox);
            },   
            
            reloadMail: function(){
	            $('#mailIFrame').attr("src", $('#mailIFrame').attr('src'));
			    $("#mailIFrame").load(function() {
			        $(this).height( $(this).contents().find("preview").height() );
			    });
            },     
			
			sendMail: function(){
				var email = $("#emailaddress").val();
			    var blockbox = globalBlockBox;
			    $.post(globalUrlPrefix+'/send-mail', {
			           "email": email,
			           "blockbox": blockbox,
			        },function(json) {
					    if (json.status == 1) {
			               swal(json.title, json.msg, 'success');
			           } else {
			               swal(json.title, json.msg, 'error');
			           }
			        },"json");
			},
			
            drawModals: function(blockbox) {
                              
                var e = this;
                                
                for (b in this.settings.blocks) {
                    var block = e.settings.blocks[b];

                    
                    var li  = $("<li>");
                    var div = $("<div>").addClass("option").appendTo(li);
                    var a   = $("<a>").addClass("action").on("click", { name: block }, function (event) {
                        e.addBlock(event.data.name, "" , blockbox);
                    }).html("" + 
                        "<div class=\"icon\"><i class=\"fa fa-" + block.icon + "\"></i></div>" +
                        "<div class=\"title\">" + block.title + "</div>").appendTo(div);

                    $(".actionList").append(li);
                }
            },

            save: function () {
                var e = this;
                var grid = this.gridster;

                var params = grid.serialize()

                var items = [];
                var order = [];
                var data = $(':input').serialize();
				
				var j = 0;
                for (p in params) {
                    c = params[p].col;
                    r = params[p].row;
                    pos = params[p].position;
                    i = r*10+c;
                    id = params[p].id.replace("widget", "");
                    data = data + "&positions%5B"+id+"%5D="+pos;
                    items[i] = id;
                    j++;
                }

                var i = 0;
                for (item in items) {
                    if (items[item] > 0) {
                        data = data + "&order%5B"+i+"%5D="+items[item];
                        i++;
                    }
                }

                var blockbox = this.settings.blockbox;
				data = data + "&blockbox="+blockbox;

                $.post(globalUrlPrefix+'/save-data', data , function(json, textStatus, xhr) {
                    /*optional stuff to do after success */
					if (json.status == 1) {
						e.reloadMail();
						e.reloadPreview();
						swal({   
							title: json.title,
							timer: 2000,
							type: 'success'
						});
					} 
		 			else {
					 	swal(json.title, json.msg, 'error');
		 			}
                }, 'json');

            },


            addBlock: function (block, datablock, blockbox, cloneid) {
                var e = this;
                
                id = datablock['id'];
                
                console.log(this.settings);
                
                if (datablock == "" ) {
	                var loaddata = false;
	                var newid = this.settings.iterator++;
	            }
	            else {
		            var newid = id;
	                var loaddata = true;
	                this.settings.iterator = Math.max(this.settings.iterator + 1, newid + 1);
	            }
                var grid = this.gridster;
				
                var li = $("<li>").attr("id", "widget" + newid).prop("data-id", newid);
                var wrapper = $("<div>").addClass("wrapper text-wrapper").appendTo(li);
                var container = $("<div style=\"background-color:"+this.settings.background_color+"\">").addClass("container").attr("id", "editor" + newid).html("<div class=\"loader\"><div class=\"loader-inner ball-pulse\"><div></div><div></div><div></div></div></div>").appendTo(wrapper)
                var toolbox = $("<div>").addClass("toolbox").appendTo(wrapper);
                if (datablock == "" ) {
	                
	                var newX = 3;
	                var newY = 2;
	                if (cloneid !== undefined) {
		                var cloneElement = $("#widget"+cloneid);
		                newX = $(cloneElement).attr("data-sizex") * 1;
   		                newY = $(cloneElement).attr("data-sizey") * 1;
	                }
		            var htmlgrid = this.gridster.add_widget(li, newX, newY);
                }
                else {
                    var htmlgrid = this.gridster.add_widget(li, datablock['sizeX'], datablock['sizeY'], datablock['column'], datablock['row']);
                }


                // Attach save button
                var savea = $("<a>").appendTo(toolbox);
                var save = $("<i>").addClass("fa fa-floppy-o").on("click", { id : newid , name : blockbox }, function (event) { 

               		var data = $('#widget'+event.data.id+' :input').serialize();
               		data = data + "&blockbox="+ event.data.name;
               		
                    $.post(globalUrlPrefix+'/save-block', data, function(json, textStatus, xhr) {
	                    if (json.status == 1) {
							swal({   
								title: json.title,
								timer: 2000,
								type: 'success'
							});
						} 
			 			else {
						 	swal(json.title, json.msg, 'error');
			 			}
                	}, 'json');
                	}).appendTo(savea);

                // Load/refresh button
                var loada = $("<a>").appendTo(toolbox);
                var load = $("<i>").addClass("fa fa-refresh").on("click", function () { 
                    alert("load");
                }).appendTo(loada);

                // Duplicate/copy button
                var copya = $("<a>").appendTo(toolbox);
                var copy = $("<i>").addClass("fa fa-files-o").on("click", { 'block' : block, id : newid , name : blockbox , newid : this.settings.iterator, 'gridster' : e } , function (event) {
	                var e = event.data.gridster;
					e.addBlock(event.data.block, "", event.data.name, event.data.id);
					
					
                }).appendTo(copya);

                // Remove button
                var trasha = $("<a>").appendTo(toolbox);
                var trash = $("<i>").addClass("fa fa-trash-o").on("click", { id : newid , name : blockbox } , function (event) {
                    grid.remove_widget(htmlgrid);
                    $.post(globalUrlPrefix+'/remove-block', { 'id': event.data.id , 'blockbox' : event.data.name }, function(json, textStatus, xhr) {
	                    $("#widget"+json.id+" .container").html(json.html);
	                }, 'json');
                
                }).appendTo(trasha);

                // Settings button
                var settinga = $("<a>").appendTo(toolbox);
                var setting = $("<i>").addClass("fa fa-cog").on("click", { id : newid , name : blockbox, search: block.search } ,  function (event) {

	                var data = $('#widget'+event.data.id+' :input').serialize();
	                $('#widget'+event.data.id+' :input').prop('disabled', true);
               		data = data + "&blockbox="+ event.data.name;
	                
	                $.post(globalUrlPrefix+'/load-settings', data ,function(json) {
					    if (json.status == 1) {
		                	$( ".elementPanel.collapsable.widgetSettings" ).find(".content").slideToggle(700, "easeOutBounce");
							$("#widgetSettingContent").html(json.html);
							$('input.colorpicker').minicolors();
							var searchurl = $(".customProductInput").attr("data-ajax--url");
					        $('.customProductInput').select2({
					            minimumInputLength: 2,
					            allowClear: true,
					            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
					                    url: searchurl,
					                    dataType: 'json',
					                    quietMillis: 250,
					                    data: function (term, page) {
					                        return {
					                            q: term, // search term
					                        };
					                    },
					                    results: function (data, page) { // parse the results into the format expected by Select2.
					                        // since we are using custom formatting functions we do not need to alter the remote JSON data
					                        return { results: data.results };
					                    },
					                    cache: true
					            },
					            initSelection: function(element, callback) {
						            var data = [];
						            data.push({
							            name: "name",
							            id: 1
						            });
						            callback(data);
						        },
						        formatResult: function (item) { 
						            var html="<li>";
						            html+='  '+item.name+' ';
						            html+="</li>";
						            return html;
						        },
						        formatSelection: function (item) { 
						            return item.name;
						        },
						        escapeMarkup: function (m) { 
								}
					        }).trigger("change");

							// AjaxForm
							$("#settingForm").ajaxForm({
								'dataType':'json',
								'url': globalUrlPrefix+"/edit-block",
				                'success': function(json) {
				                    swal({
				                        title: json.title,
				                        text: json.msg,
				                        type: json.type,
				                    }, function(){
					                    
				                        if(json.status == 1) {
					                        if (json.image) {
						                        $('#img_'+json.blockid).attr('src', json.image);
						                        widgetSettings();
					                        }				                        
					                        	
											$.post(globalUrlPrefix+'/load-block', { 'id': json.blockid , 'blockbox' : json.blockbox }, function(json, textStatus, xhr) {
								                $("#widget"+json.id+" .container").html(json.html);
								            }, 'json');		
								            

				                        }
				                    }); // end swal            
				                }							
							});
		               } else {
		                   swal(json.title, json.msg, 'error');
		               }
		            },"json");
		            
		            
                }).appendTo(settinga);

                // Attach drag button
                var movea = $("<a>").addClass("moveWidget").appendTo(toolbox)
                var move = $("<i>").addClass("fa fa-arrows-alt").appendTo(movea);
				
				//console.log(block);
				if (loaddata) {
					$.post(globalUrlPrefix+'/load-block', { 'id': newid , 'blockbox' : blockbox }, function(json, textStatus, xhr) {
	                    $("#widget"+json.id+" .container").html(json.html); 
	                }, 'json');					
				}
				else if (cloneid !== undefined) {
					$.post(globalUrlPrefix+'/clone-block', { 'newid': newid, 'block' : block , 'blockbox' : blockbox, 'clone' : cloneid }, function(json, textStatus, xhr) {
	                    $("#widget"+json.id+" .container").html(json.html);
	                }, 'json');	

				}
				else {
					$.post(globalUrlPrefix+'/new-block', { 'newid': newid, 'block' : block , 'blockbox' : blockbox }, function(json, textStatus, xhr) {
	                    $("#widget"+json.id+" .container").html(json.html);
	                }, 'json');
				}
				
                newid++;

                $( ".addBlockModal" ).removeClass('md-show');
                $( ".contentblockContainer .inner .contentBlock").css('display', 'block');
                setTimeout( equalizeNow, 300 );
  
				
            },
            
            loadBlocks: function (data, blockbox) {
	            for (b in data) {
		            this.addBlock(false, data[b], blockbox);
	            }
            }
		});
		
		$.fn[ pluginName ] = function ( options, params ) {
            var returns;
			
			this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
                else if ($.isFunction(Plugin.prototype[options])) {
                    returns = $.data(this, 'plugin_' + pluginName)[options](params);
                }
			});
            return returns !== undefined ? returns : this;
		};

})( jQuery, window, document );



