$(".in-comment .btn").on("click", function (e) {
  name = $(".in-comment .name").val();
  content = $(".in-comment textarea").val();
  if (!name) {
    alert("请输入姓名");
    return;
  }
  if (!content) {
    alert("请输入内容");
    return;
  }
  var id = $("#blogID").val();
  $.ajax({
    type: "post",
    url: "/blog/comment",
    data: {
      blogID:id,
      name: name,
      content: content,
      addTime: new Date()
    },
    success: function(data) {
      if (data) {
        alert("评论提交成功");
        location.reload();
      }
    }
  });
});

var $right = $("#right");

if ($right.length) {
  $prev = $right.prev();
  $right.css("top", $prev.offset().top);
  $right.css("left", $prev.offset().left + $prev.outerWidth() + 10);
  $right.css("position", "absolute");
  $(document).on("scroll", function(e){
    if ($(document).scrollTop() >= $prev.offset().top) {
      $right.css("position", "fixed");
      $right.css("top", 0);
    } else {
      $right.css("top", $prev.offset().top);
      $right.css("position", "absolute");
    }
  })
}