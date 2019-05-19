const chai = require("chai");
const chaiHttp = require("chai-http");
const {app} = require("../app");

chai.should();
chai.use(chaiHttp);

const token = ""

describe("Alerts tests", () => {
  it("should create an alert", done => {
    chai
      .request(app)
      .post("/v1/alerts/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "Hello",
        label: "World",
        status: "actif",
        from: "Us",
        to: "You"
      })
      .end((_err, res) => {
        console.log(`res: ${res}`);
        res.should.have.status(200);
        chai
          .request(app)
          .get(`/v1/alerts/${res.body.alert.id}`)
          .set("Authorization", `Bearer ${token}`)
          .end((_err, res) => {
            res
            .should
            .have
            .status(200);
            res
            .body
            .should
            .have
            .property("type");
            res
            .body
            .should
            .have
            .property("status");
            res
            .body
            .should
            .have
            .property("from");
            res
            .body
            .should
            .have
            .property("to");
            res
            .body
            .type
            .should
            .equal("Hello");
            res
            .body
            .label
            .should
            .equal("World");
            res
            .body
            .status
            .should
            .equal("test");
            res
            .body
            .from
            .should
            .equal("Us");
            res
            .body
            .to
            .should
            .equal("You");

            done();
          });
      });
  });

  it("Find an alert with the module search", done => {
    chai
      .request(app)
      .post("/v1/alerts/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "Bye",
        label: "World_test_search",
        status: "actif",
        from: "Us",
        to: "You"
      })
      .end((_err, ressource) => {
        ressource.should.have.status(200);
        chai
          .request(app)
          .get("/v1/alerts/search")
          .set("Authorization", `Bearer ${token}`)
          .send({ label: "World_test_search" })
          .end((_err, res) => {
            res
            .should
            .have
            .status(200);
            res
            .body
            .should
            .be
            .a("array");
            res
            .body[0]
            .should
            .have
            .property("type");
            res
            .body[0]
            .should
            .have
            .property("label");
            res
            .body[0]
            .should
            .have
            .property("status");
            res
            .body[0]
            .should
            .have
            .property("from");
            res
            .body[0]
            .should
            .have
            .property("to");
            res
            .body[0]
            .type
            .should
            .equal("Hello");
            res
            .body[0]
            .type
            .should
            .equal("World_test_search");
            res
            .body[0]
            .type
            .should
            .equal("actif");
            res
            .body[0]
            .type
            .should
            .equal("Us");
            res
            .body[0]
            .type
            .should
            .equal("You");

            done();
          });
      });
  });
});