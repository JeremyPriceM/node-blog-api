const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const {app, runServer, closeServer} = require('../server');



chai.use(chaiHttp);

describe('blog-posts', function (){
    before(function(){
        return runServer();
    });
    after(function(){
        return closeServer();
    });
    it('Should list blog post on GET', function(){
        return chai
        .request(app)
        .get('/blog-posts')
        .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.above(0);
            res.body.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.have.all.keys(
                    'id', 'title', 'content', 'author', "publishDate");
            });
        });
    });
    it('should add an item on POST', function() {
        const newItem = {title: "The Stand", content: "A flu epidemic", author: "Stephen King" };
        return chai
        .request(app)
        .post("/blog-posts")
        .send(newItem)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(
                Object.assign(newItem, {id: res.body.id, publishDate: res.body.publishDate })
            );
        });
    });
    it('should update item on PUT', function() {
        return chai
        .request(app)
        .get('/blog-posts')
        .then(function(res) {
            const updateData = Object.assign(res.body[0], {
                title: 'The Fifth Risk',
                author: 'Michael Lewis',
                content: 'Paints a portrait of a government led by the uninterested'
            });
            return chai
            .request(app)
            .put(`/blog-posts/${res.body[0].id}`)
            .send(updateData)
            .then(function(res) {
                expect(res).to.have.status(204);
            });
        });
    });
    it('should delete items on DELETE', function() {
        return chai
        .request(app)
        .get('/blog-posts')
        .then(function(res) {
            return chai
            .request(app)
            .delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
            expect(res).to.have.status(204);
        });
    });
});