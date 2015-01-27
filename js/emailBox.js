;(function ( $, window, document, undefined ) {
        var searchTimeout;
		var pluginName = "emailBox";
		var defaults = {
            urlPrefix: '/emailbox',
            
            deleteConfirmTitle: 'Item verwijderen',
            deleteConfirmText: 'Weet je zeker dat je dit item wilt verwijderen?',
            deleteConfirmConfirmButtonText: 'Ja, verwijderen',
            deleteConfirmCancelButtonText: 'annuleren',
            
            toPlaceholderText: 'Ontvanger(s) van het bericht...',
            subjectPlaceholderText: 'Onderwerp...',
            bodyPlaceholderText: 'Jouw bericht...',
            
            addButtonText: 'Nieuw bericht',
            sendButtonText: 'Bericht versturen',
            cancelButtonText: 'Annuleren',
            answerButtonText: 'Beantwoorden',
            deleteButtonText: 'Verwijderen',
            archiveButtonText: 'Archiveren',

            showNewEmailButton: true,
            showLabelButton: false,
            showAnswerButton: true,
            showArchiveButton: true,
            showDeleteButton: true,
            
            customButtons: [],
            
            composeItem: false,
            archiveItem: false,
            answerItem: false,
            deleteItem: false,
            sendMessage: false,
            changeLabel: false,
            
            params: {},
            
            labels: [],
            
            minHeight: 600,
            correctionTopBody: 20,
            
            composeBoxID: 'emailboxPluginComposeTextAreaID',
            messageIDs: [],
            currentPage: 0,
            loadingPages: false,
            clearResultsOnSearch: false,
            activeMessage: 0,
            iframeSandbox: true,
            contentTemplate: 'email',
            
            listPane: {},
            previewPane: {},
            composePane: {},
            listContainer: {},
            contentContainer: {},
            searchInput: {},
            searchDelay: 1000,
            searchTimeout: false,
            labelSelect: {}
            
		};
        
		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
    				// Contruct container
    				$(this.element).addClass('emailBox');
    				this.container = $('<div>').addClass('mid').appendTo(this.element);
    				
    				// Contruct Panes:
    				this.contructListPane();
    				this.contructPreviewPane();
    				this.contructComposePane();
    				this.resetCompose();
    				
    				// Clear Panes:
    				$('<div>').addClass('clear').appendTo(this.container);
				},
				
				
				contructListPane: function() {
    				this.listPane = $('<div>').addClass('inbox').appendTo(this.container);
    				
    				$searchHolder = $('<div>').addClass('searchholder').appendTo(this.listPane);
    				this.searchInput = $('<input type="search">').data("plugin", this).attr('placeholder', 'Zoeken...').appendTo($searchHolder).keyup(this.searchboxChange);
    				$('<i>').addClass('fi-magnifying-glass').appendTo($searchHolder);
    				
    				this.listContainer = $('<ul>').data("plugin", this).appendTo(this.listPane);
    				
                    this.listContainer.scroll(function() {
                        var $plugin = $(this).data("plugin");
                        if($(this).scrollTop() > this.scrollHeight - $($plugin.element).parent().height() - 20) {
                            $plugin.nextPage();
                        }
                    }); 
				},
				
				contructPreviewPane: function() {
    				this.previewPane = $('<div>').addClass('email').appendTo(this.container);
    				
                    $topBar = $('<div>').addClass('top').appendTo(this.previewPane);
                    $topBarRight = $('<div>').addClass('rightSide').appendTo($topBar);
    				$topBarOptions = $('<ul>').addClass('options').appendTo($topBarRight);
                    
    				if(this.settings.showNewEmailButton) {
        				$addBtn = $('<button>').addClass('new').html(this.settings.addButtonText).data("plugin", this).appendTo($topBar);
        				
                        if($addBtn.click(this.settings.composeItem) !== false) {
                            $addBtn.click(this.defaultComposeMessage);
                        }
    				}
    				
    				if(this.settings.showLabelButton) {
        				this.labelSelect = $('<select>').data("plugin", this).appendTo($topBarRight);
        				for(var i in this.settings.labels) {
            				$('<option>').attr('value', this.settings.labels[i].id).html(this.settings.labels[i].label).appendTo(this.labelSelect);
        				}
        				
                        if(this.labelSelect.change(this.settings.changeLabel) !== false) {
                            this.labelSelect.change(this.defaultLabelChange);
                        }
    				}

    				var isFirst = true;
    				
    				if(this.settings.customButtons.length > 0) {
        				for(var i in this.settings.customButtons) {
            				var tmpCustomBtn = this.settings.customButtons[i];
            				
                            var $customBtn = $('<li>').html(tmpCustomBtn.label).data("plugin", this).appendTo($topBarOptions);
            				if(isFirst) $customBtn.addClass('first');
            				if(
            				    !this.settings.showArchiveButton && 
            				    !this.settings.showArchiveButton && 
            				    !this.settings.showArchiveButton && 
            				    !this.settings.showDeleteButton
            				) $customBtn.addClass('last');
            				
                			$customBtn.click(tmpCustomBtn.action);	
            				isFirst = false;
        				}
    				}
    				
    				if(this.settings.showAnswerButton) {
                        var $btn1 = $('<li>').html(this.settings.answerButtonText).data("plugin", this).appendTo($topBarOptions);
        				if(isFirst) $btn1.addClass('first');
        				if(!this.settings.showArchiveButton && !this.settings.showDeleteButton) $btn1.addClass('last');
        				isFirst = false;
        				
                        if($btn1.click(this.settings.answerItem) !== false) {
                            $btn1.click(this.defaultAnswerMessage);
                        }
                        
    				}
    				if(this.settings.showDeleteButton) {
        				var $btn2 = $('<li>').html(this.settings.deleteButtonText).data("plugin", this).appendTo($topBarOptions);
        				if(isFirst) $btn2.addClass('first');
        				if(!this.settings.showArchiveButton) $btn2.addClass('last');
        				isFirst = false;
        				
                        if($btn2.click(this.settings.deleteItem) !== false) {
                            $btn2.click(this.defaultDeleteMessage);
                        }
    				}
    				if(this.settings.showArchiveButton) {
        				var $btn3 = $('<li>').html(this.settings.archiveButtonText).addClass('last').data("plugin", this).appendTo($topBarOptions);
        				if(isFirst) $btn3.addClass('first');
        				isFirst = false;
        				
                        if($btn3.click(this.settings.archiveItem) !== false) {
                            $btn3.click(this.defaultArchiveMessage);
                        }
    				}
    				
    				$('<p>').addClass('info').appendTo($topBarRight);

    				$topBarNav = $('<ul>').addClass('options').appendTo($topBarRight);
    				$('<li>').addClass('fi-arrow-left').addClass('first').data("plugin", this).click(this.prevMessage).appendTo($topBarNav);
    				$('<li>').addClass('fi-arrow-right').addClass('last').data("plugin", this).click(this.nextMessage).appendTo($topBarNav);
                    
                    if(this.settings.contentTemplate == 'email') {
        				this.contentContainer = $('<div>').addClass('message').appendTo(this.previewPane);
                    } else {
        				this.contentContainer = $('<div>').addClass('plain').appendTo(this.previewPane);
                    }

    				$('<div>').addClass('clear').appendTo($topBar);
				},
				
				contructComposePane: function() {
    				this.composePane = $('<div>').addClass('email').appendTo(this.container);
    				
                    $topBar = $('<div>').addClass('top').appendTo(this.composePane);
                    $topBarRight = $('<div>').addClass('rightSide').appendTo($topBar);
    				$topBarOptions = $('<ul>').addClass('options').appendTo($topBarRight);
                    
    				if(this.settings.showNewEmailButton) {
        				$sendBtn = $('<button>').addClass('new').html(this.settings.sendButtonText).data("plugin", this).appendTo($topBar);
        				
                        if($sendBtn.click(this.settings.sendMessage) !== false) {
                            $sendBtn.click(this.defaultSendMessage);
                        }
    				}
    				var $cancelButton = $('<li>').html(this.settings.cancelButtonText).data("plugin", this).appendTo($topBarOptions);
                    $cancelButton.addClass('first').addClass('last');
                    $cancelButton.click(function() {
        				var plugin = $(this).data('plugin');
        				plugin.composePane.hide();
        				plugin.previewPane.show();
                    });


    				$('<div>').addClass('clear').appendTo($topBar);

                    $composeContainer = $('<div>').addClass('message').appendTo(this.composePane);
    				$image = $('<div>').addClass('image').appendTo($composeContainer).html('<img src="/static/images/default_employee.svg" />');
    				
    				$title = $('<p>').appendTo($composeContainer);
    				$subject = $('<input type="text" name="to">').addClass('to').attr('placeholder', this.settings.toPlaceholderText).appendTo($title);
    				
    				$title = $('<p>').addClass('title').appendTo($composeContainer);
    				$subject = $('<input type="text" name="subject">').addClass('subject').attr('placeholder', this.settings.subjectPlaceholderText).appendTo($title);
    				
    				
    				$title = $('<p>').appendTo($composeContainer);
    				$subject = $('<textarea name="body">').attr('id', this.settings.composeBoxID).addClass('to').attr('placeholder', this.settings.bodyPlaceholderText).height('100%').appendTo($title);
    				
    				this.ckeditor = CKEDITOR.replace( this.settings.composeBoxID );
    				
                    $('<div>').addClass('divider').appendTo($composeContainer);
				},
				
				addListItem: function(params) {
    				$item = $('<li>').data('message', params).appendTo(this.listContainer);
    				if(params.status=='new') {
        				$item.addClass('new');
    				}
    				$('<p>').addClass('name').html(params.from).appendTo($item);
    				$('<p>').addClass('subject').html(params.subject).appendTo($item);
    				$('<p>').addClass('text').html(params.body).appendTo($item);
    				
    				var tmp = this;
    				$item.click(function() {
        				var p = $(this).data('message');
        				tmp.getMessage(p.id);
    				});
				},
				
				clearList: function() {
    				this.listContainer.html('');
				},
				
				searchboxChange: function() {
    				var plugin = $(this).data('plugin');
    				clearTimeout(plugin.settings.searchTimeout);
    				plugin.settings.searchTimeout = setTimeout(function() {
        				plugin.search();
    				}, plugin.settings.searchDelay);
				},
				
				doSearch: function() {
    				var tmp = this;
    				
    				var params = $.extend({}, this.settings.params,  {
                         "query": this.searchInput.val()
                        ,"page": this.settings.currentPage
                        ,"newsearch": this.settings.clearResultsOnSearch
    				});
    				
    				$.get(this.settings.urlPrefix+"/getlist", params, function(json) {
    				        if(json.status) {
                                if(tmp.settings.clearResultsOnSearch) {
                                    tmp.clearList();
                				    tmp.settings.currentPage = 0;
                				    tmp.settings.messageIDs = [];
                                }
            				    if(json.messages.length>0) {
            				        for(var i in json.messages) {
                				        tmp.addListItem(json.messages[i]);
                				        tmp.settings.messageIDs.push( json.messages[i].id );
            				        }
            				    } else {
                                    if(tmp.settings.clearResultsOnSearch) {
                    				    tmp.addListItem({
                        				    'id': 0, 'status': 'open', 'from': 'geen berichten', 'to': '', 'date': '', 'subject': '', 'body': ''
                    				    });
                    				}
            				    }
    				        } else {
    				            swal(json.title, json.msg, 'error');
    				        }
    				    }, "json"
    				);
				},
				
				search: function() {
    				this.settings.currentPage = 0;
    				this.settings.clearResultsOnSearch = true;
                    this.doSearch();
				},
				
				nextPage: function() {
    				this.settings.currentPage = this.settings.currentPage + 1;
    				this.settings.clearResultsOnSearch = false;
                    this.doSearch();
				},
				
				addPreview: function(params) {
    				
    				if(this.settings.contentTemplate == 'email') {
        				$image = $('<div>').addClass('image').appendTo(this.contentContainer).html('<img src="/static/images/default_employee.svg" />');
        				$title = $('<p>').addClass('title').html(params.subject).appendTo(this.contentContainer);
        				
        				if(params.label.length>0) {
            				$('<span>').addClass('label').addClass('right').html(params.label).appendTo($title);
        				}
        				
        				$info = $('<p>').addClass('info').appendTo(this.contentContainer);
        				$info.append('van: <span>'+params.from+'</span>');
        				$info.append(' <span class="bullet">&#8226;</span> ');
        				$info.append('aan: <span>'+params.to+'</span>');
        				$info.append(' <span class="bullet">&#8226;</span> ');
        				$info.append(params.date);
        				
        				for(var i in params.attachments) {
                            $('<a>').addClass('fi-paperclip').addClass('attachment').html(params.attachments[i].name).attr("href", params.attachments[i].url).attr("target", "_blank").appendTo(this.contentContainer);
        				}
        				
                        $('<div>').addClass('divider').appendTo(this.contentContainer);
    				} 

                    
                    if(this.settings.iframeSandbox) {
        				$iframe = $('<iframe>').attr("seamless","").addClass('fullWidth').appendTo(this.contentContainer);
                        $iframe.get(0).contentWindow.document.write(params.body);
                    } else {
        				$iframe = $('<div>').addClass('fullWidth').html(params.body).appendTo(this.contentContainer);
                    }
                    
                    
                    $iframe.height( $(this.listContainer).height() - this.settings.correctionTopBody - 40 ).css('overflow-y', 'scroll');
                    
                    $('<div>').addClass('divider').appendTo(this.contentContainer);
                    
                    this.settings.activeMessage = params.id;
                    
    				this.composePane.hide();
    				this.previewPane.show();
				},
				
				clearPreview: function() {
    				this.contentContainer.html('');
				},
				
				getMessage: function(id) {
    				var tmp = this;
    				
    				var params = $.extend({}, this.settings.params,  {
                        "message": id
    				});
    				
    				tmp.clearPreview();
    				$.get(this.settings.urlPrefix+"/getpreview", params, function(json) {
    				        if(json.status) {
            				    tmp.addPreview(json.message);
                				$('li', tmp.listContainer).removeClass('active');
                				
                				var index = tmp.settings.messageIDs.indexOf(id);
                				$('li:nth-child('+(index+1)+')', tmp.listContainer).addClass('active').removeClass('new');
                				
    				        } else {
    				            swal(json.title, json.msg, 'error');
    				        }
    				    }, "json"
    				);
				},
				
				nextMessage: function() {
    				var plugin = $(this).data('plugin');
    				var messages = plugin.settings.messageIDs;
    				var old = plugin.settings.activeMessage;
    				
                    index = messages.indexOf(old);
                    if(index >= 0 && index < messages.length - 1) {
                        plugin.getMessage( messages[index + 1] );
                    }
				},
				
				prevMessage: function() {
    				var plugin = $(this).data('plugin');
    				var messages = plugin.settings.messageIDs;
    				var old = plugin.settings.activeMessage;
    				
                    index = messages.indexOf(old);
                    if(index >= 0 && index < messages.length - 1) {
                        plugin.getMessage( messages[index - 1] );
                    }
				},
				
				resetCompose: function() {
    				this.composePane.hide();
    				$('input.subject', this.element).val('');
    				$('input.to', this.element).val('');
    				this.ckeditor.setData('');
    				
    				this.previewPane.show();
				},
				
				defaultComposeMessage: function() {
    				var plugin = $(this).data('plugin');
    				plugin.previewPane.hide();
    				plugin.composePane.show();
				},
				
				defaultSendMessage: function() {
    				var plugin = $(this).data("plugin");
    				
                    $.post(plugin.settings.urlPrefix+"/send-message", {
                         'subject': $('input.subject', plugin.element).val()
                        ,'to': $('input.to', plugin.element).val()
                        ,'body': plugin.ckeditor.getData()
                    }, function(json) {
                        if(json.status==1) {
                            swal(json.title, json.msg, 'success');
                            plugin.search();
            				plugin.resetCompose();
                        } else {
                            swal(json.title, json.msg, 'error');
                        }
                    }, 'json');
				},
				
				defaultDeleteMessage: function() {
    				var plugin = $(this).data("plugin");
                    var index = plugin.settings.messageIDs.indexOf(plugin.settings.activeMessage);
                    $.post(plugin.settings.urlPrefix+"/set-action", {
                        'action': 'delete',
                        'id': plugin.settings.activeMessage
                    }, function(json) {
                        if(json.status==1) {
                            plugin.search();
                            $(this.previewPane).html('');
                        } else {
                            swal(json.title, json.msg, 'error');
                        }
                    }, 'json');
				},
				
				defaultArchiveMessage: function() {
    				var plugin = $(this).data("plugin");
                    $.post(plugin.settings.urlPrefix+"/set-action", {
                        'action': 'archive',
                        'id': plugin.settings.activeMessage
                    }, function(json) {
                        if(json.status==1) {
                            swal(json.title, json.msg, 'success');
                            plugin.search();
                        } else {
                            swal(json.title, json.msg, 'error');
                        }
                    }, 'json');
				},
				
				defaultLabelChange: function() {
    				var plugin = $(this).data("plugin");
                    $.post(plugin.settings.urlPrefix+"/set-label", {
                        'label': $(plugin.labelSelect).val(),
                        'message': plugin.settings.activeMessage
                    }, function(json) {
                        if(json.status==1) {
                            // do nothing
                        } else {
                            swal(json.title, json.msg, 'error');
                        }
                    }, 'json');
				},
				
				
				setParams: function(newParams) {
    				this.settings.params = newParams;
				}
				
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options, params ) {
				this.each(function() {
                    if (!$.data(this, 'plugin_' + pluginName)) {
                        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                    }
                    else if ($.isFunction(Plugin.prototype[options])) {
                        $.data(this, 'plugin_' + pluginName)[options](params);
                    }
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );
