openerp.web.ListView.include({
  /**
   * Override all list view to add sticky header behavior
   **/
  init: function(parent, dataset, view_id, options) {
    var self = this;
    this._super(parent, dataset, view_id, options);
  },

  do_show: function(){
    /**
     * Move search div to a fixed location.
     * Add scroll event listener and remove leftover headers
     **/
    this._super();
    $('.oe_view_manager_body').slice(1).remove();
    $('.oe_view_manager_body').off('scroll.sticky_header');
    self = this;
    self.delete_fix_headers();
    var event_set = false;
    // we avoid to have the listener attach many time on scroll bar
    if ($._data($('.oe_view_manager_body')[0], 'events')){
      even_set = $._data($('.oe_view_manager_body')[0], 'events').scroll.some(function(element, index, array) {
        return element.namespace == 'sticky_header';
      });
    };
    if (! event_set){
      $('.oe_view_manager_body').on('scroll.sticky_header', self.do_sticky_headers);
    };
    var search_div = $('.oe_searchview_drawer_container').detach();
    $('.oe_view_manager_header').after(search_div);
  },

  do_hide: function(){

    /**
     * Move search div to a fixed location.
     * Add scroll event listener and remove leftover headers
     **/
    self = this;
    this._super();
    self.delete_fix_headers();
    $('.oe_view_manager_body').slice(1).remove();
    $('.oe_view_manager_body').off('scroll.sticky_header');
  },

  delete_fix_headers: function(){
    /**
     * Delete the sticky header created by `do_sticky_header`
     **/
    if ($('.oe_list_content_containers_custom').length > 0){
      $('.oe_list_content_containers_custom').remove();
    };
    $('.oe_list_content').find('thead').css('visibility', 'visible');
  },

  get_original_headers: function(){
    /**
     * Get original table header element of list view
     **/
    return original_headers = $(
        $('.oe_list_content').children()[0]
        );
  },

  do_sticky_headers: function(){
    /**
     * Copy actual header without event listener
     * and set a suitable position in layout
     **/
    if ($('.oe_view_manager_body').scrollTop() === 0){
      this.delete_fix_headers();
      return;
    };
    if ($('.oe_list_content_containers_custom').length > 0) {
      return;
    };
    var sticky_headers_containers = $(document.createElement('div'));
    var sticky_headers = $(document.createElement('table'));
    sticky_headers_containers.addClass('oe_list_content_containers_custom');
    sticky_headers_containers.append(sticky_headers);
    sticky_headers.width($('.oe_list_content').width());
    var original_headers = this.get_original_headers();
    var headers_copy = original_headers.clone();
    jQuery.map(headers_copy.find('div'), function(el, i){
      $(el).removeAttr('width');
      $(el).removeAttr('height');
      $(el).width($(original_headers.find('div')[i]).width());
      $(el).height($(original_headers.find('div')[i]).height());

    });
    jQuery.map(headers_copy.find('th'), function(el, i){
      $(el).removeAttr('width');
      $(el).removeAttr('height');
      $(el).width($(original_headers.find('th')[i]).width());
      $(el).height($(original_headers.find('th')[i]).height());
    });
    sticky_headers.append(headers_copy);
    sticky_headers.addClass('oe_list_content_custom');

    $('.oe_searchview_drawer_container').after(sticky_headers_containers);
    $('.oe_list_content').find('thead').css('visibility', 'hidden');
  },
});
openerp.web.ViewManager.include({
  /**
   * Hack to prevent error that appear on addons list
   * due to custom override that calls switch_mode mutliple times
   * */
  switch_mode: function (view_type, no_store, options) {
    var res =  this._super(view_type, no_store, options);
    $('.oe_view_manager_body').slice(1).remove();
    $('.oe_view_manager_body').off('scroll.sticky_header');
  },
  return res;
});
