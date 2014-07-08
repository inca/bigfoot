$.bigfoot.install('form.multiselect', function() {
  var form = $(this)
    , selectAll = form.find('#selectAll, .selectAll')
    , selectItems = form.find('.selectItem:not([disabled])')
    , selectBy = form.find('.selectBy')
    , enableIfSelected= $('.enableIfSelected')
    , showIfSelected = $('.showIfSelected')
    , selectCount = $('.selectedCount');

  function update() {
    var count = selectItems.filter(':checked').size();
    selectCount.text(' (' + count + ')');
    if (count == 0) {
      showIfSelected.hide();
      enableIfSelected.each(function() {
        var elem = $(this)
          , href = elem.attr('href');
        elem.attr('disabled', 'disabled');
        if (href != 'javascript:;') {
          elem.attr('data-href', href);
          elem.attr('href', 'javascript:;');
        }
      });
    } else {
      showIfSelected.show();
      enableIfSelected.each(function() {
        var elem = $(this)
          , originalHref = elem.attr('data-href');
        elem.removeAttr('disabled');
        if (originalHref)
          elem.attr('href', originalHref);
      });
    }
    selectAll.prop('checked', count == selectItems.size());
    selectBy.each(function() {
      var trigger = $(this)
        , selector = trigger.attr('data-selector')
        , items = selectItems.filter(selector)
        , selected = items.filter(':checked');
      trigger.prop('checked', items.size() == selected.size());
    });
  }

  selectItems.unbind('.multiselect')
    .bind('change.multiselect', update);

  selectAll.unbind('.multiselect')
    .bind('change.multiselect', function() {
      selectItems.prop('checked', $(this).is(':checked'));
      update();
    });

  selectBy.each(function() {
    var trigger = $(this)
      , selector = trigger.attr('data-selector');
    trigger.unbind('.multiselect')
      .bind('change.multiselect', function() {
        selectItems.filter(selector).prop('checked', trigger.is(':checked'));
        update();
      });
  });

  update();
});