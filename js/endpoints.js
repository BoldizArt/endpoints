(function ($, Drupal, drupalSettings) {
/* START */

  $(document).ready(function(){
    var protocol = $(location).attr("protocol");
    var hostname = $(location).attr("hostname");
    var url = protocol+"//"+hostname;

    // USER
    $("#cu-submit").click(function(){
      var name = $("#cu-name").val();
      var mail = $("#cu-mail").val();
      var pass = $("#cu-pass").val();
      createUser(name, mail, pass);
    });
    $("#login-submit").click(function(){
      var user = $("#user").val();
      var pass = $("#pass").val();
      login(user, pass);
    });
    $("#logout-submit").click(function(){
      logout();
    });

    // NODE
    // Create node
    $("#cn-submit").click(function(){
      var title = $("#cn-title").val();
      var body = $("#cn-body").val();
      postNode(title, body);
    });
    // Update node
    $("#un-submit").click(function(){
      var title = $("#un-title").val();
      var body = $("#un-body").val();
      var id = $("#un-id").val();
      updateNode(id, title, body);
    });
    // Get node
    $("#gn-submit").click(function(){
      var id = $("#gn-id").val();
      getNode(id);
    });
    // Delete node
    $("#dn-submit").click(function(){
      var id = $("#dn-id").val();
      deleteNode(id);
    });

    // COMMENT //
    // Post comment 
    $("#cc-submit").click(function(){
      var subject = $("#cc-subject").val();
      var body = $("#cc-body").val();
      var nid = $("#cc-id").val();
      postComment(nid, subject, body);
    });
    // Update comment
    $("#uc-submit").click(function(){
      var cid = $("#uc-id").val();
      var subject = $("#uc-subject").val();
      var body = $("#uc-body").val();
      updateComment(cid, subject, body);
    });
    $("#gc-submit").click(function(){
      var id = $("#gc-id").val();
      getComment(id);
    });
    // Delete comment
    $("#dc-submit").click(function(){
      var cid = $("#dc-id").val();
      deleteComment(cid);
    });

    // CREATE COMMENT START //
    function postComment(nid, subject, body, status = "1") {
      // Get current user info
      $.get(url+"/json/getuser").done(function(response){
        // Current user id
        var uid = response.uid;
        var jsonData = {
          _links: {
            type: {
              href: url+"/rest/type/comment/comment"
            }
          },
          entity_id: [
            {target_id: nid}
          ],
          entity_type: [
            {value: "node"}
          ],
          comment_type: [
            {target_id: "comment"}
          ],
          field_name: [
            {value: "comment"}
          ],
          uid: [
            {target_id: uid}
          ],
          status: [
            {value: status}
          ],
          subject: [
            {value: subject}
          ],
          comment_body: [
            {value: body}
          ]
        }
        // Get token for current user
        $.get(url+"/rest/session/token").done(function(response) {
          var csrfToken = response;
          console.info(csrfToken);
          // Post 
          $.ajax({
            url: url+'/entity/comment?_format=hal_json',
            method: 'POST',
            data: JSON.stringify(jsonData),
            headers: {
              'X-CSRF-Token': csrfToken,
              'Content-Type': 'application/hal+json',
              "Accept": "application/hal+json",
            },
            dataType: "json",
            success: function (createdComment) {
              console.info(createdComment);
              console.info(jsonData);
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.info(textStatus);
            }
          });
        });
      });
    }
    // CREATE COMMENT END //


    // UPDATE COMMENT START //
    function updateComment(cid, subject, body) {
      // Get current user info
      $.get(url+"/json/getuser").done(function(response){
        // Current user id
        var uid = response.uid;
        var jsonData = {
          _links: {
            type: {
              href: url+"/rest/type/comment/comment"
            }
          },
          "comment_type":[
            {"target_id": "comment"}
          ],
          "subject":[
            {"value": subject}
          ],
          "comment_body":[
              {"value": body}
          ]
        }

        $.get(url+"/rest/session/token").done(function(response) {
          var csrfToken = response;
          console.info(csrfToken);
          // Update 
          $.ajax({
            url: url+"/comment/"+cid+"?_format=hal_json",
            method: 'PATCH',
            headers: {
              'X-CSRF-Token': csrfToken,
              'Content-Type': 'application/hal+json'
            },
            data: JSON.stringify(jsonData),
            success: function (response) {
              console.info(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.info(textStatus);
            }
          });
        });
      });
    }
    // UPDATE COMMENT END //


    // GET COMMENT START //
    function getComment(cid){
      $.get(url+"/comment/"+cid+"?_format=hal_json").done(function(response){
        console.info(response);
      });
    };
    // GET COMMENT END //


    // DELETE COMMENT START //
    function deleteComment(cid) {
      var jsonData = {
        _links: {
          type: {
            href: url+"/rest/type/comment/comment"
          }
        },
        "comment_type":[
          {"target_id": "comment"}
        ]
      }

      $.get(url+"/rest/session/token").done(function(response) {
        var csrfToken = response;
        console.info(csrfToken);
        // Update 
        $.ajax({
          url: url+"/comment/"+cid+"?_format=hal_json",
          method: 'DELETE',
          headers: {
            'X-CSRF-Token': csrfToken,
            'Content-Type': 'application/hal+json'
          },
          data: JSON.stringify(jsonData),
          success: function (response) {
            console.info(response);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.info(textStatus);
          }
        });
      });
    }
    // DELETE COMMENT END //



    // CREATE USER START //
    function createUser(name, mail, pass) {
      var jsonData = {
        "_links": {
          "type": {
            "href": url+"/rest/type/user/user"
          }
        },
        "name": {"valie": name},
        "mail": {"value": mail},
        "pass": {"value": pass}
      }

      $.ajax({
        url: url+"/user/register?_format=hal_json",
        type: "POST",
        data: JSON.stringify(jsonData),
        headers: {
          "Content-Type": "application/hal+json",
          "Accept": "application/hal+json",
        },
        dataType: "json",
        success: function(response){
          console.info(response);
        },
        error: function(response){
          console.info("Šmrc!");
        }
      });

    }
    // CREATE USER END //


    // LOGIN START //
    function login(user, pass) {
      var jsonData = {
        "name": user,
        "pass": pass
      }
      // login
      $.ajax({
        url: url+"/user/login?_format=json",
        type: "POST",
        data: JSON.stringify(jsonData),
        headers: {
          "Content-Type": "application/hal+json",
          "Accept": "application/json",
        },
        dataType: "json",
        success: function (response) {
          console.info(response);
          console.info(response.csrf_token);
        }
      });
    }
    // LOGIN END //


    // LOGOUT START
    function logout(){
      $.post(url+"/user/logout", {}).done(function(response){
        console.info(response);
      });
    }
    // LOGOUT END //


    // POST NODE START //
    function postNode(nodeTitle, nodeBody) {
      var jsonData = 
        {
          "_links": {
            "type": {
              "href":url+"/rest/type/node/article"
            }
          },
          "title": [
            {"value": nodeTitle}
          ],
          "body": [
            {"value": nodeBody}
          ]
        }
      // Get token for current user
      $.get(url+"/rest/session/token").done(function(response) {
        var csrfToken = response;
        console.info(csrfToken);
        // Post 
        $.ajax({
          url: url+"/node?_format=hal_json",
          type: "POST",
          data: JSON.stringify(jsonData),
          headers: {
            "Content-Type": "application/hal+json",
            "Accept": "application/json",
            "X-CSRF-Token": csrfToken
          },
          dataType: "json",
          success: function (response) {
              console.info(response);
          }
        });
      });
    };
    // POST NODE END //


    // UPDATE NODE START //
    function updateNode(nid, nodeTitle, nodeBody) {
      var jsonData = 
        {
          "_links": {
            "type": {
              "href":url+"/rest/type/node/article"
            }
          },
          "title": [
            {"value": nodeTitle}
          ],
          "body": [
            {"value": nodeBody}
          ]
        }
      // Get token for current user
      $.get(url+"/rest/session/token").done(function (response) {
        var csrfToken = response;
        console.log(csrfToken);
        // Update
        $.ajax({
          url: (url+"/node/"+nid+"?_format=hal_json"),
          type: "PATCH",
          data: JSON.stringify(jsonData),
          headers: {
            "Content-Type": "application/hal+json",
            "Accept": "application/json",
            "X-CSRF-Token": csrfToken
          },
          dataType: "json",
          success: function (response) {
            console.info(response);
          }
        });
      });
    };
    // UPDATE NODE END //


    // GET NODE START //
    function getNode(nid){
      $.get(url+"/node/"+nid+"?_format=hal_json").done(function(response){
        console.info(response);
      });
    };
    // GET NODE END //


    // DELETE NODE START //
    function deleteNode(nid) {
      var jsonData = 
        {
          "_links": {"type":
            {"href":url+"/rest/type/node/article"}
          }
        }
      // Get token for current user
      $.get(url+"/rest/session/token").done(function (response) {
        var csrfToken = response;
        console.log(csrfToken);
        // Delete
        $.ajax({
          url: (url+"/node/"+nid),
          type: "DELETE",
          data: JSON.stringify(jsonData),
          headers: {
            "Content-Type": "application/hal+json",
            "Accept": "application/json",
            "X-CSRF-Token": csrfToken
          },
          dataType: "json",
          success: function (response) {
            console.info(response);
          }
        });
      });
    };
    // DELETE NODE END //

  });

/* END */
})(jQuery, Drupal, drupalSettings);