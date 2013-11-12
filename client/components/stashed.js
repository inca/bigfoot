$.bigfoot.msg['changes.dirty'] = "Changes not saved.";
$.bigfoot.msg['changes.revert'] = "Revert changes";

$.bigfoot.install('textarea.stashed', function() {
  var textarea = $(this);

  // Id attribute on textarea is mandatory
  var id = textarea.attr("id");
  if (!id)
    return;
  // Save server value on textarea element
  textarea[0].__originalValue = textarea.val();
  // Key combines current URL with textarea's ID
  var key = $.sha256(location.href.replace(/\?.*/g, "")) + ":" + id;
  // Init stashed value
  var stashed = window.localStorage.getItem(key);
  if (stashed) {
    textarea.val(stashed);
    updateMark();
  }
  // Values get updated on every keystroke
  textarea.unbind(".autosave")
    .bind("keyup.bigfoot.autosave", function() {
      var value = textarea.val();
      if (value == getOriginalValue())
        localStorage.removeItem(key);
      else
        localStorage.setItem(key, value);
      updateMark();
    });
  // Stashed value should be clean on postSubmit if form exists
  var form = textarea.parents("form");
  if (form)
    form.bind("postSubmit.bigfoot.autosave", function() {
      window.localStorage.removeItem(key);
      textarea[0].__originalValue = textarea.val();
      updateMark();
    });

  function getOriginalValue() {
    return textarea[0].__originalValue;
  }

  function isDirty() {
    return textarea[0].__dirty == true;
  }

  function markDirty() {
    if (isDirty()) return;
    var warningBlock = $('<div class="dirty"></div>');
    warningBlock.text($.bigfoot.msg['changes.dirty']);
    var revertLink = $('<a href="javascript:;" class="revert"></a>');
    revertLink.attr("title", $.bigfoot.msg['changes.revert']);
    revertLink.bind("click.bigfoot.autosave", revert);
    warningBlock.append(revertLink);
    textarea.after(warningBlock);
    textarea[0].__dirty = true;
  }

  function markClean() {
    if (!isDirty()) return;
    $("+ .dirty", textarea).remove();
    textarea[0].__dirty = false;
  }

  function updateMark() {
    if (getOriginalValue() == textarea.val())
      markClean();
    else markDirty();
  }

  function revert() {
    textarea.val(getOriginalValue());
    window.localStorage.removeItem(key);
    markClean();
  }
});
