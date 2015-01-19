function connectToClient() {
    var plugin = $(this).data('plugin');
    
    if(plugin.settings.activeMessage==0) return false;
    
    swal({
              title: "Selecteer een client..."
            , text: $("#connectClient").html()
            , showCancelButton: true
            , confirmButtonText: "Ja, koppelen"
            , cancelButtonText: "annuleren"
            , closeOnConfirm: false 
            , allowHTML: true
        }, function() {
            $.post("/emailbox/api/connect-message", {
                     "message": plugin.settings.activeMessage
                    ,"client": $("#connectToClientField", $('.showSweetAlert')).val()
                }, function(json) {
                    if(json.status) {
                        swal({
                              title: json.title
                            , text: json.msg
                            , type: "success"
                        }, function() {
                            //window.location.reload();
                        });
                    } else {
                        swal(json.title, json.msg, 'error');
                    }
                }, "json"
            );
        }
    );
    
    $("#connectToClientField", $('.showSweetAlert')).select2({
        placeholder: "Selecteer een project...",
        minimumInputLength: 2,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
           		url: "/erp/clients/select2",
                dataType: 'json',
                quietMillis: 250,
                cache: true,
           		data: function (term, page) {
        	   		return {
        		   		q: term,
        		   		page_limit: 10,
        		   		page: page,
        		   	};
        		},
        		results: function (data, page) {
        			var res = {
        				results: [], 
        				more: false
        			};
        			if(data.items){
        				var more = (page * 10) < data.total_count; 
        				res = {
        					results: data.items, 
        					more: more
        				};
        			}
        			return res;
        		}
        },
        allowClear: true
    });    
}

function connectToProject() {
    var plugin = $(this).data('plugin');
    
    if(plugin.settings.activeMessage==0) return false;
    
    swal({
              title: "Koppel aan Project"
            , text: $("#connectProject").html()
            , showCancelButton: true
            , confirmButtonText: "Ja, koppelen"
            , cancelButtonText: "annuleren"
            , closeOnConfirm: false 
            , allowHTML: true
        }, function() {
            $.post("/emailbox/api/connect-message", {
                     "message": plugin.settings.activeMessage
                    ,"project": $("#connectToProjectField", $('.showSweetAlert')).val()
                }, function(json) {
                    if(json.status) {
                        swal({
                              title: json.title
                            , text: json.msg
                            , type: "success"
                        }, function() {
                            //window.location.reload();
                        });
                    } else {
                        swal(json.title, json.msg, 'error');
                    }
                }, "json"
            );
        }
    );
    
    $("#connectToProjectField", $('.showSweetAlert')).select2({
        placeholder: "Selecteer een project...",
        minimumInputLength: 2,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: "/time/select-projects",
                dataType: 'json',
                quietMillis: 250,
                data: function (term, page) {
                    return {
                        q: term
                    };
                },
                results: function (data, page) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter the remote JSON data
                    return { results: data.items };
                },
                cache: true
        },
        allowClear: true
    });    
    
}
