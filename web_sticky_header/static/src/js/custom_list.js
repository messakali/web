openerp.web.ListView.include({
  /**
   * Override all list view to add sticky header behavior
   **/
  init: function(parent, dataset, view_id, options) {
    var self = this;
    this._super(parent, dataset, view_id, options);
    this.first_scroll = false;
  },

  do_show: function(post_function){
    /**
     * Move search div to a fixed location.
     * Add scroll event listener and remove leftover headers
     **/
    this._super();
    self = this;
    self.delete_fix_headers();
    $('.oe_view_manager_body').on('scroll', self.do_sticky_headers);
    var search_div = $('.oe_searchview_drawer_container').detach();
    $('.oe_view_manager_header').after(search_div)
  },

  delete_fix_headers: function(){
    /**
     * Delete the sticky header created by `do_sticky_header`
     **/
    if ($('.oe_list_content_containers_custom').length > 0){
      $('.oe_list_content_containers_custom').remove();
    };
    $('.oe_list_content').find('thead').css('visibility', 'visible');
    this.first_scroll = false;
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
    if (this.first_scroll){
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
    this.first_scroll = true;
  },
  header_is_in_scroll: function(){
    /**
    *Helper that tells if original table header is visible.
    *It is not use yet but available for more advance dev
    *var head = this.get_original_headers();
    *var frame = $('.oe_view_manager_body');
    *var hidden = frame.scrollTop();
    *return (hidden < head.height());
    **/
  },
});
