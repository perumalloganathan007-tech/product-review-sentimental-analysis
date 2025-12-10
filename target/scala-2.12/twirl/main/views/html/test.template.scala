
package views.html

import _root_.play.twirl.api.TwirlFeatureImports._
import _root_.play.twirl.api.TwirlHelperImports._
import _root_.play.twirl.api.Html
import _root_.play.twirl.api.JavaScript
import _root_.play.twirl.api.Txt
import _root_.play.twirl.api.Xml
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

object test extends _root_.play.twirl.api.BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,_root_.play.twirl.api.Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with _root_.play.twirl.api.Template0[play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply():play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {


Seq[Any](format.raw/*1.1*/("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Connection Test - Sentiment Analysis</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .test-card """),format.raw/*9.20*/("""{"""),format.raw/*9.21*/("""
            """),format.raw/*10.13*/("""margin-bottom: 20px;
        """),format.raw/*11.9*/("""}"""),format.raw/*11.10*/("""
        """),format.raw/*12.9*/(""".response-box """),format.raw/*12.23*/("""{"""),format.raw/*12.24*/("""
            """),format.raw/*13.13*/("""background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin-top: 10px;
            max-height: 300px;
            overflow-y: auto;
        """),format.raw/*20.9*/("""}"""),format.raw/*20.10*/("""
        """),format.raw/*21.9*/(""".success """),format.raw/*21.18*/("""{"""),format.raw/*21.19*/(""" """),format.raw/*21.20*/("""color: #28a745; """),format.raw/*21.36*/("""}"""),format.raw/*21.37*/("""
        """),format.raw/*22.9*/(""".error """),format.raw/*22.16*/("""{"""),format.raw/*22.17*/(""" """),format.raw/*22.18*/("""color: #dc3545; """),format.raw/*22.34*/("""}"""),format.raw/*22.35*/("""
        """),format.raw/*23.9*/(""".loading """),format.raw/*23.18*/("""{"""),format.raw/*23.19*/(""" """),format.raw/*23.20*/("""color: #ffc107; """),format.raw/*23.36*/("""}"""),format.raw/*23.37*/("""
    """),format.raw/*24.5*/("""</style>
</head>
<body>
    <div class="container mt-4">
        <h1 class="mb-4">🔗 Frontend-Backend Connection Test</h1>

        <!-- Database Connection Test -->
        <div class="card test-card">
            <div class="card-header">
                <h5>1. Database Connection Test</h5>
            </div>
            <div class="card-body">
                <button id="testDbBtn" class="btn btn-primary">Test Database Connection</button>
                <div id="dbResponse" class="response-box d-none"></div>
            </div>
        </div>

        <!-- Dataset Analysis Test -->
        <div class="card test-card">
            <div class="card-header">
                <h5>2. Dataset Analysis Test</h5>
            </div>
            <div class="card-body">
                <form id="testDatasetForm">
                    <div class="mb-3">
                        <label for="testProductName" class="form-label">Product Name</label>
                        <input type="text" class="form-control" id="testProductName" value="Test Product - iPhone 15">
                    </div>
                    <div class="mb-3">
                        <label for="testDatasetFile" class="form-label">Dataset File (Optional - will use mock data)</label>
                        <input type="file" class="form-control" id="testDatasetFile" accept=".csv,.json,.xlsx">
                    </div>
                    <button type="submit" class="btn btn-success">Test Dataset Analysis</button>
                </form>
                <div id="datasetResponse" class="response-box d-none"></div>
            </div>
        </div>

        <!-- URL Analysis Test -->
        <div class="card test-card">
            <div class="card-header">
                <h5>3. URL Analysis Test</h5>
            </div>
            <div class="card-body">
                <form id="testUrlForm">
                    <div class="mb-3">
                        <label for="testUrls" class="form-label">Product URLs (one per line)</label>
                        <textarea class="form-control" id="testUrls" rows="3">https://www.amazon.com/test-product-1
https://www.flipkart.com/test-product-2</textarea>
                    </div>
                    <button type="submit" class="btn btn-warning">Test URL Analysis</button>
                </form>
                <div id="urlResponse" class="response-box d-none"></div>
            </div>
        </div>

        <!-- History Test -->
        <div class="card test-card">
            <div class="card-header">
                <h5>4. Analysis History Test</h5>
            </div>
            <div class="card-body">
                <button id="testHistoryBtn" class="btn btn-info">Load Analysis History</button>
                <div id="historyResponse" class="response-box d-none"></div>
            </div>
        </div>

        <!-- Database Stats -->
        <div class="card test-card">
            <div class="card-header">
                <h5>5. Database Statistics</h5>
            </div>
            <div class="card-body">
                <button id="testStatsBtn" class="btn btn-secondary">Get Database Stats</button>
                <div id="statsResponse" class="response-box d-none"></div>
            </div>
        </div>
    </div>

    <script>
        class APITester """),format.raw/*104.25*/("""{"""),format.raw/*104.26*/("""
            """),format.raw/*105.13*/("""constructor() """),format.raw/*105.27*/("""{"""),format.raw/*105.28*/("""
                """),format.raw/*106.17*/("""this.init();
            """),format.raw/*107.13*/("""}"""),format.raw/*107.14*/("""

            """),format.raw/*109.13*/("""init() """),format.raw/*109.20*/("""{"""),format.raw/*109.21*/("""
                """),format.raw/*110.17*/("""document.getElementById('testDbBtn').addEventListener('click', () => this.testDatabase());
                document.getElementById('testDatasetForm').addEventListener('submit', (e) => this.testDatasetAnalysis(e));
                document.getElementById('testUrlForm').addEventListener('submit', (e) => this.testUrlAnalysis(e));
                document.getElementById('testHistoryBtn').addEventListener('click', () => this.testHistory());
                document.getElementById('testStatsBtn').addEventListener('click', () => this.testStats());
            """),format.raw/*115.13*/("""}"""),format.raw/*115.14*/("""

            """),format.raw/*117.13*/("""showResponse(elementId, content, type = 'info') """),format.raw/*117.61*/("""{"""),format.raw/*117.62*/("""
                """),format.raw/*118.17*/("""const element = document.getElementById(elementId);
                element.className = `response-box $"""),format.raw/*119.52*/("""{"""),format.raw/*119.53*/("""type"""),format.raw/*119.57*/("""}"""),format.raw/*119.58*/("""`;
                element.classList.remove('d-none');
                element.innerHTML = `<pre>$"""),format.raw/*121.44*/("""{"""),format.raw/*121.45*/("""JSON.stringify(content, null, 2)"""),format.raw/*121.77*/("""}"""),format.raw/*121.78*/("""</pre>`;
            """),format.raw/*122.13*/("""}"""),format.raw/*122.14*/("""

            """),format.raw/*124.13*/("""showLoading(elementId) """),format.raw/*124.36*/("""{"""),format.raw/*124.37*/("""
                """),format.raw/*125.17*/("""const element = document.getElementById(elementId);
                element.className = 'response-box loading';
                element.classList.remove('d-none');
                element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            """),format.raw/*129.13*/("""}"""),format.raw/*129.14*/("""

            """),format.raw/*131.13*/("""async testDatabase() """),format.raw/*131.34*/("""{"""),format.raw/*131.35*/("""
                """),format.raw/*132.17*/("""this.showLoading('dbResponse');
                try """),format.raw/*133.21*/("""{"""),format.raw/*133.22*/("""
                    """),format.raw/*134.21*/("""const response = await fetch('/api/test/db');
                    const result = await response.json();

                    if (response.ok) """),format.raw/*137.38*/("""{"""),format.raw/*137.39*/("""
                        """),format.raw/*138.25*/("""this.showResponse('dbResponse', result, 'success');
                    """),format.raw/*139.21*/("""}"""),format.raw/*139.22*/(""" """),format.raw/*139.23*/("""else """),format.raw/*139.28*/("""{"""),format.raw/*139.29*/("""
                        """),format.raw/*140.25*/("""this.showResponse('dbResponse', result, 'error');
                    """),format.raw/*141.21*/("""}"""),format.raw/*141.22*/("""
                """),format.raw/*142.17*/("""}"""),format.raw/*142.18*/(""" """),format.raw/*142.19*/("""catch (error) """),format.raw/*142.33*/("""{"""),format.raw/*142.34*/("""
                    """),format.raw/*143.21*/("""this.showResponse('dbResponse', """),format.raw/*143.53*/("""{"""),format.raw/*143.54*/(""" """),format.raw/*143.55*/("""error: error.message """),format.raw/*143.76*/("""}"""),format.raw/*143.77*/(""", 'error');
                """),format.raw/*144.17*/("""}"""),format.raw/*144.18*/("""
            """),format.raw/*145.13*/("""}"""),format.raw/*145.14*/("""

            """),format.raw/*147.13*/("""async testDatasetAnalysis(e) """),format.raw/*147.42*/("""{"""),format.raw/*147.43*/("""
                """),format.raw/*148.17*/("""e.preventDefault();
                this.showLoading('datasetResponse');

                const formData = new FormData();
                formData.append('productName', document.getElementById('testProductName').value);
                formData.append('isPreprocessed', 'false');
                formData.append('datasetType', 'csv');

                const fileInput = document.getElementById('testDatasetFile');
                if (fileInput.files[0]) """),format.raw/*157.41*/("""{"""),format.raw/*157.42*/("""
                    """),format.raw/*158.21*/("""formData.append('dataset', fileInput.files[0]);
                """),format.raw/*159.17*/("""}"""),format.raw/*159.18*/(""" """),format.raw/*159.19*/("""else """),format.raw/*159.24*/("""{"""),format.raw/*159.25*/("""
                    """),format.raw/*160.21*/("""// Create a dummy file for testing
                    const dummyFile = new Blob(['review_text,rating\n"Great product!",5\n"Not bad",3'], """),format.raw/*161.105*/("""{"""),format.raw/*161.106*/(""" """),format.raw/*161.107*/("""type: 'text/csv' """),format.raw/*161.124*/("""}"""),format.raw/*161.125*/(""");
                    formData.append('dataset', dummyFile, 'test_data.csv');
                """),format.raw/*163.17*/("""}"""),format.raw/*163.18*/("""

                """),format.raw/*165.17*/("""try """),format.raw/*165.21*/("""{"""),format.raw/*165.22*/("""
                    """),format.raw/*166.21*/("""const response = await fetch('/api/analyze/dataset', """),format.raw/*166.74*/("""{"""),format.raw/*166.75*/("""
                        """),format.raw/*167.25*/("""method: 'POST',
                        body: formData
                    """),format.raw/*169.21*/("""}"""),format.raw/*169.22*/(""");
                    const result = await response.json();

                    if (response.ok) """),format.raw/*172.38*/("""{"""),format.raw/*172.39*/("""
                        """),format.raw/*173.25*/("""this.showResponse('datasetResponse', result, 'success');
                    """),format.raw/*174.21*/("""}"""),format.raw/*174.22*/(""" """),format.raw/*174.23*/("""else """),format.raw/*174.28*/("""{"""),format.raw/*174.29*/("""
                        """),format.raw/*175.25*/("""this.showResponse('datasetResponse', result, 'error');
                    """),format.raw/*176.21*/("""}"""),format.raw/*176.22*/("""
                """),format.raw/*177.17*/("""}"""),format.raw/*177.18*/(""" """),format.raw/*177.19*/("""catch (error) """),format.raw/*177.33*/("""{"""),format.raw/*177.34*/("""
                    """),format.raw/*178.21*/("""this.showResponse('datasetResponse', """),format.raw/*178.58*/("""{"""),format.raw/*178.59*/(""" """),format.raw/*178.60*/("""error: error.message """),format.raw/*178.81*/("""}"""),format.raw/*178.82*/(""", 'error');
                """),format.raw/*179.17*/("""}"""),format.raw/*179.18*/("""
            """),format.raw/*180.13*/("""}"""),format.raw/*180.14*/("""

            """),format.raw/*182.13*/("""async testUrlAnalysis(e) """),format.raw/*182.38*/("""{"""),format.raw/*182.39*/("""
                """),format.raw/*183.17*/("""e.preventDefault();
                this.showLoading('urlResponse');

                const urls = document.getElementById('testUrls').value.split('\n').filter(url => url.trim());
                const requestData = """),format.raw/*187.37*/("""{"""),format.raw/*187.38*/(""" """),format.raw/*187.39*/("""urls """),format.raw/*187.44*/("""}"""),format.raw/*187.45*/(""";

                try """),format.raw/*189.21*/("""{"""),format.raw/*189.22*/("""
                    """),format.raw/*190.21*/("""const response = await fetch('/api/analyze/urls', """),format.raw/*190.71*/("""{"""),format.raw/*190.72*/("""
                        """),format.raw/*191.25*/("""method: 'POST',
                        headers: """),format.raw/*192.34*/("""{"""),format.raw/*192.35*/(""" """),format.raw/*192.36*/("""'Content-Type': 'application/json' """),format.raw/*192.71*/("""}"""),format.raw/*192.72*/(""",
                        body: JSON.stringify(requestData)
                    """),format.raw/*194.21*/("""}"""),format.raw/*194.22*/(""");
                    const result = await response.json();

                    if (response.ok) """),format.raw/*197.38*/("""{"""),format.raw/*197.39*/("""
                        """),format.raw/*198.25*/("""this.showResponse('urlResponse', result, 'success');
                    """),format.raw/*199.21*/("""}"""),format.raw/*199.22*/(""" """),format.raw/*199.23*/("""else """),format.raw/*199.28*/("""{"""),format.raw/*199.29*/("""
                        """),format.raw/*200.25*/("""this.showResponse('urlResponse', result, 'error');
                    """),format.raw/*201.21*/("""}"""),format.raw/*201.22*/("""
                """),format.raw/*202.17*/("""}"""),format.raw/*202.18*/(""" """),format.raw/*202.19*/("""catch (error) """),format.raw/*202.33*/("""{"""),format.raw/*202.34*/("""
                    """),format.raw/*203.21*/("""this.showResponse('urlResponse', """),format.raw/*203.54*/("""{"""),format.raw/*203.55*/(""" """),format.raw/*203.56*/("""error: error.message """),format.raw/*203.77*/("""}"""),format.raw/*203.78*/(""", 'error');
                """),format.raw/*204.17*/("""}"""),format.raw/*204.18*/("""
            """),format.raw/*205.13*/("""}"""),format.raw/*205.14*/("""

            """),format.raw/*207.13*/("""async testHistory() """),format.raw/*207.33*/("""{"""),format.raw/*207.34*/("""
                """),format.raw/*208.17*/("""this.showLoading('historyResponse');
                try """),format.raw/*209.21*/("""{"""),format.raw/*209.22*/("""
                    """),format.raw/*210.21*/("""const response = await fetch('/api/analyses');
                    const result = await response.json();

                    if (response.ok) """),format.raw/*213.38*/("""{"""),format.raw/*213.39*/("""
                        """),format.raw/*214.25*/("""this.showResponse('historyResponse', result, 'success');
                    """),format.raw/*215.21*/("""}"""),format.raw/*215.22*/(""" """),format.raw/*215.23*/("""else """),format.raw/*215.28*/("""{"""),format.raw/*215.29*/("""
                        """),format.raw/*216.25*/("""this.showResponse('historyResponse', result, 'error');
                    """),format.raw/*217.21*/("""}"""),format.raw/*217.22*/("""
                """),format.raw/*218.17*/("""}"""),format.raw/*218.18*/(""" """),format.raw/*218.19*/("""catch (error) """),format.raw/*218.33*/("""{"""),format.raw/*218.34*/("""
                    """),format.raw/*219.21*/("""this.showResponse('historyResponse', """),format.raw/*219.58*/("""{"""),format.raw/*219.59*/(""" """),format.raw/*219.60*/("""error: error.message """),format.raw/*219.81*/("""}"""),format.raw/*219.82*/(""", 'error');
                """),format.raw/*220.17*/("""}"""),format.raw/*220.18*/("""
            """),format.raw/*221.13*/("""}"""),format.raw/*221.14*/("""

            """),format.raw/*223.13*/("""async testStats() """),format.raw/*223.31*/("""{"""),format.raw/*223.32*/("""
                """),format.raw/*224.17*/("""this.showLoading('statsResponse');
                try """),format.raw/*225.21*/("""{"""),format.raw/*225.22*/("""
                    """),format.raw/*226.21*/("""const response = await fetch('/api/test/stats');
                    const result = await response.json();

                    if (response.ok) """),format.raw/*229.38*/("""{"""),format.raw/*229.39*/("""
                        """),format.raw/*230.25*/("""this.showResponse('statsResponse', result, 'success');
                    """),format.raw/*231.21*/("""}"""),format.raw/*231.22*/(""" """),format.raw/*231.23*/("""else """),format.raw/*231.28*/("""{"""),format.raw/*231.29*/("""
                        """),format.raw/*232.25*/("""this.showResponse('statsResponse', result, 'error');
                    """),format.raw/*233.21*/("""}"""),format.raw/*233.22*/("""
                """),format.raw/*234.17*/("""}"""),format.raw/*234.18*/(""" """),format.raw/*234.19*/("""catch (error) """),format.raw/*234.33*/("""{"""),format.raw/*234.34*/("""
                    """),format.raw/*235.21*/("""this.showResponse('statsResponse', """),format.raw/*235.56*/("""{"""),format.raw/*235.57*/(""" """),format.raw/*235.58*/("""error: error.message """),format.raw/*235.79*/("""}"""),format.raw/*235.80*/(""", 'error');
                """),format.raw/*236.17*/("""}"""),format.raw/*236.18*/("""
            """),format.raw/*237.13*/("""}"""),format.raw/*237.14*/("""
        """),format.raw/*238.9*/("""}"""),format.raw/*238.10*/("""

        """),format.raw/*240.9*/("""document.addEventListener('DOMContentLoaded', () => """),format.raw/*240.61*/("""{"""),format.raw/*240.62*/("""
            """),format.raw/*241.13*/("""new APITester();
        """),format.raw/*242.9*/("""}"""),format.raw/*242.10*/(""");
    </script>
</body>
</html>
"""))
      }
    }
  }

  def render(): play.twirl.api.HtmlFormat.Appendable = apply()

  def f:(() => play.twirl.api.HtmlFormat.Appendable) = () => apply()

  def ref: this.type = this

}


              /*
                  -- GENERATED --
                  SOURCE: app/views/test.scala.html
                  HASH: 8adaa36017b1f69b23aa70210714719cc6917c41
                  MATRIX: 810->0|1177->341|1205->342|1246->355|1302->384|1331->385|1367->394|1409->408|1438->409|1479->422|1730->646|1759->647|1795->656|1832->665|1861->666|1890->667|1934->683|1963->684|1999->693|2034->700|2063->701|2092->702|2136->718|2165->719|2201->728|2238->737|2267->738|2296->739|2340->755|2369->756|2401->761|5752->4083|5782->4084|5824->4097|5867->4111|5897->4112|5943->4129|5997->4154|6027->4155|6070->4169|6106->4176|6136->4177|6182->4194|6770->4753|6800->4754|6843->4768|6920->4816|6950->4817|6996->4834|7128->4937|7158->4938|7191->4942|7221->4943|7348->5041|7378->5042|7439->5074|7469->5075|7519->5096|7549->5097|7592->5111|7644->5134|7674->5135|7720->5152|8014->5417|8044->5418|8087->5432|8137->5453|8167->5454|8213->5471|8294->5523|8324->5524|8374->5545|8545->5687|8575->5688|8629->5713|8730->5785|8760->5786|8790->5787|8824->5792|8854->5793|8908->5818|9007->5888|9037->5889|9083->5906|9113->5907|9143->5908|9186->5922|9216->5923|9266->5944|9327->5976|9357->5977|9387->5978|9437->5999|9467->6000|9524->6028|9554->6029|9596->6042|9626->6043|9669->6057|9727->6086|9757->6087|9803->6104|10287->6559|10317->6560|10367->6581|10460->6645|10490->6646|10520->6647|10554->6652|10584->6653|10634->6674|10803->6813|10834->6814|10865->6815|10912->6832|10943->6833|11067->6928|11097->6929|11144->6947|11177->6951|11207->6952|11257->6973|11339->7026|11369->7027|11423->7052|11527->7127|11557->7128|11685->7227|11715->7228|11769->7253|11875->7330|11905->7331|11935->7332|11969->7337|11999->7338|12053->7363|12157->7438|12187->7439|12233->7456|12263->7457|12293->7458|12336->7472|12366->7473|12416->7494|12482->7531|12512->7532|12542->7533|12592->7554|12622->7555|12679->7583|12709->7584|12751->7597|12781->7598|12824->7612|12878->7637|12908->7638|12954->7655|13199->7871|13229->7872|13259->7873|13293->7878|13323->7879|13375->7902|13405->7903|13455->7924|13534->7974|13564->7975|13618->8000|13696->8049|13726->8050|13756->8051|13820->8086|13850->8087|13959->8167|13989->8168|14117->8267|14147->8268|14201->8293|14303->8366|14333->8367|14363->8368|14397->8373|14427->8374|14481->8399|14581->8470|14611->8471|14657->8488|14687->8489|14717->8490|14760->8504|14790->8505|14840->8526|14902->8559|14932->8560|14962->8561|15012->8582|15042->8583|15099->8611|15129->8612|15171->8625|15201->8626|15244->8640|15293->8660|15323->8661|15369->8678|15455->8735|15485->8736|15535->8757|15707->8900|15737->8901|15791->8926|15897->9003|15927->9004|15957->9005|15991->9010|16021->9011|16075->9036|16179->9111|16209->9112|16255->9129|16285->9130|16315->9131|16358->9145|16388->9146|16438->9167|16504->9204|16534->9205|16564->9206|16614->9227|16644->9228|16701->9256|16731->9257|16773->9270|16803->9271|16846->9285|16893->9303|16923->9304|16969->9321|17053->9376|17083->9377|17133->9398|17307->9543|17337->9544|17391->9569|17495->9644|17525->9645|17555->9646|17589->9651|17619->9652|17673->9677|17775->9750|17805->9751|17851->9768|17881->9769|17911->9770|17954->9784|17984->9785|18034->9806|18098->9841|18128->9842|18158->9843|18208->9864|18238->9865|18295->9893|18325->9894|18367->9907|18397->9908|18434->9917|18464->9918|18502->9928|18583->9980|18613->9981|18655->9994|18708->10019|18738->10020
                  LINES: 26->1|34->9|34->9|35->10|36->11|36->11|37->12|37->12|37->12|38->13|45->20|45->20|46->21|46->21|46->21|46->21|46->21|46->21|47->22|47->22|47->22|47->22|47->22|47->22|48->23|48->23|48->23|48->23|48->23|48->23|49->24|129->104|129->104|130->105|130->105|130->105|131->106|132->107|132->107|134->109|134->109|134->109|135->110|140->115|140->115|142->117|142->117|142->117|143->118|144->119|144->119|144->119|144->119|146->121|146->121|146->121|146->121|147->122|147->122|149->124|149->124|149->124|150->125|154->129|154->129|156->131|156->131|156->131|157->132|158->133|158->133|159->134|162->137|162->137|163->138|164->139|164->139|164->139|164->139|164->139|165->140|166->141|166->141|167->142|167->142|167->142|167->142|167->142|168->143|168->143|168->143|168->143|168->143|168->143|169->144|169->144|170->145|170->145|172->147|172->147|172->147|173->148|182->157|182->157|183->158|184->159|184->159|184->159|184->159|184->159|185->160|186->161|186->161|186->161|186->161|186->161|188->163|188->163|190->165|190->165|190->165|191->166|191->166|191->166|192->167|194->169|194->169|197->172|197->172|198->173|199->174|199->174|199->174|199->174|199->174|200->175|201->176|201->176|202->177|202->177|202->177|202->177|202->177|203->178|203->178|203->178|203->178|203->178|203->178|204->179|204->179|205->180|205->180|207->182|207->182|207->182|208->183|212->187|212->187|212->187|212->187|212->187|214->189|214->189|215->190|215->190|215->190|216->191|217->192|217->192|217->192|217->192|217->192|219->194|219->194|222->197|222->197|223->198|224->199|224->199|224->199|224->199|224->199|225->200|226->201|226->201|227->202|227->202|227->202|227->202|227->202|228->203|228->203|228->203|228->203|228->203|228->203|229->204|229->204|230->205|230->205|232->207|232->207|232->207|233->208|234->209|234->209|235->210|238->213|238->213|239->214|240->215|240->215|240->215|240->215|240->215|241->216|242->217|242->217|243->218|243->218|243->218|243->218|243->218|244->219|244->219|244->219|244->219|244->219|244->219|245->220|245->220|246->221|246->221|248->223|248->223|248->223|249->224|250->225|250->225|251->226|254->229|254->229|255->230|256->231|256->231|256->231|256->231|256->231|257->232|258->233|258->233|259->234|259->234|259->234|259->234|259->234|260->235|260->235|260->235|260->235|260->235|260->235|261->236|261->236|262->237|262->237|263->238|263->238|265->240|265->240|265->240|266->241|267->242|267->242
                  -- GENERATED --
              */
          