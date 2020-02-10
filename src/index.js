$(document).ready(() => {
  var template = `<div class="form-row">
  <div class="form-group col-md-3">
    <label>Email</label>
    <input type="email" class="form-control email" />
  </div>
  <div class="form-group col-md-3">
    <label>Primeiro nome</label>
    <input type="text" class="form-control firstName" />
  </div>
  <div class="form-group col-md-3">
    <label>Último nome</label>
    <input type="text" class="form-control lastName" />
  </div>
  <div class="form-group col-md-2">
    <label for="values">Valores (use vírgula)</label>
    <input
      type="text"
      class="form-control values"
      placeholder="40.50, 2, 8.35"
    />
  </div>
  <div class="form-group col-md-1">
  <label style="opacity: 0;"> Adicionar</label>
    <button type="button" class="btn btn-primary delete-field">
      ( - )
    </button>
  </div>
</div>`;

  $(".add-field").click(function() {
    $(template).insertBefore("hr");
  });

  $(".fields").on("click", ".delete-field", function() {
    $(this)
      .parent()
      .parent()
      .remove();
  });

  var template2 = `<div class="form-row">
  <div class="form-group col-md-2">
      <label>Valor do Adicional</label>
      <input type="text" class="form-control additional" />
    </div>
  <div class="form-group col-md-2">
      <label style="opacity: 0;">Operador</label>
      <select class="form-control operation">
        <option selected>PORCENTO</option>
        <option>REAIS</option>
      </select>
    </div>
<div class="form-group col-md-2">
  <label style="opacity: 0;">Sinal</label>
  <select class="form-control sign">
    <option selected>DESCONTO</option>
    <option>CUSTO</option>
  </select>
</div>
<div class="form-group col-md-1">
  <label style="opacity: 0;"> Adicionar</label>
  <button type="button" class="btn btn-primary delete-field2">
    ( - )
  </button>
</div>
</div>`;

  $(".add-field2").click(function() {
    $(template2).insertBefore("br");
  });

  $(".fields").on("click", ".delete-field2", function() {
    $(this)
      .parent()
      .parent()
      .remove();
  });

  $("#determine").on("click", function() {
    var data = getFormData();
    console.log(data);
    $.ajax({
      method: "POST",
      url: "http://localhost:8080/purchase/determine",
      data: data,
      headers: {
        accept: "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      contentType: "application/json",
      crossDomain: true,
      success: function(obj) {
        var stringToShow = "";
        for (var i = 0; i < obj.length; i++) {
          stringToShow += `${obj[i].personFullName}: R$${obj[i].total}\n`;
        }
        alert(stringToShow);
      },
      error: function(err) {
        alert('Houveram erros na requisição');
      }
    });
  });

  function getFormData() {
    var n = $(".email").length;
    var m = $(".additional").length;
    var json = '{"payingPeople": [';
    for (var i = 0; i < n; i++) {
      json += `{"email": "${$(".email")[i].value}", "firstName": "${
        $(".firstName")[i].value
      }", "lastName": "${$(".lastName")[i].value}", "order": {"values": [${
        $(".values")[i].value
      }]}},`;
    }
    json += '], "additionals":[';
    for (var j = 0; j < m; j++) {
      json += `{"value": ${$(".additional")[j].value}, "sign": "${
        $(".sign option:selected")[j].innerHTML == "DESCONTO"
          ? "NEGATIVE"
          : "POSITIVE"
      }", "operation": "${
        $(".operation option:selected")[j].innerHTML == "PORCENTO"
          ? "MULTIPLY"
          : "ADD"
      }"},`;
    }
    json += "]}";
    json = json.replace("},]", "}]").replace("},]", "}]");
    return json;
  }
});
