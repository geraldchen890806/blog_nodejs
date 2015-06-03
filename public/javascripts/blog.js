$(".in-comment .btn").on("click", function() {
    var name = $(".in-comment .name").val();
    var content = $(".in-comment textarea").val();
    var email = $(".in-comment .email").val();
    if (!name) {
        alert("请输入姓名");
        return;
    }

    if (!content) {
        alert("请输入内容");
        return;
    }
    var emailReg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    if (!email || !emailReg.test(email)) {
        alert("请输入正确的邮箱");
        return;
    }
    var id = $("#blogID").val();
    $.ajax({
        type: "post",
        url: "/blog/comment",
        data: {
            blogID: id,
            name: name,
            email: email,
            content: content,
            addTime: new Date()
        },
        success: function(data) {
            if (data) {
                alert("评论提交成功");
                location.reload();
            }
        },
        error: function() {
            location.reload();
        }
    });
});

$(".comments .del_icon ").on("click", function(e) {
    e.preventDefault();
    var href = $(this).data("url");
    var id = $(this).data("id");
    $.ajax({
        type: "post",
        url: href,
        data: {
            blogID: id
        },
        success: function(data) {
            if (data) {
                location.reload();
            }
        },
        error: function() {
            location.reload();
        }
    });
});

$(".article-delete").on("click", function() {
    return window.confirm("sure to delete");
});

$(document).on("scroll mousemove", function() {
    if (!/blog\/(?!tag\/).*/.test(location.href) || window.saveReTimes || $("#isLogin").val() == "true") return;
    window.saveReTimes = true;
    var id = $("#blogID").val();
    $.ajax({
        type: "post",
        url: "/blog/reTimes",
        data: {
            blogID: id
        },
        success: function(data) {
            //console.log(data)
        }
    });
});
