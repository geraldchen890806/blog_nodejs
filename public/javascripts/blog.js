$(".in-comment .btn").on("click", function (e) {
  name = $(".in-comment .name").val();
  content = $(".in-comment .content").val();
  if (!name) {
    alert("请输入姓名");
  }
  if (!content) {
    alert("请输入内容");
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

  })
})