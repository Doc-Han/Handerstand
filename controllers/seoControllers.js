var post = require('../models/postModel');
var tag = require('../models/tagModel');

var site = process.env.URL;

module.exports = function(app){
    app.get('/robots.txt',(req,res,next)=>{
        res.type('text/plain');
        res.send(`User-agent: *\nSitemap: ${site}/sitemap.xml`);
    });
    app.get('/sitemap.xml',(req,res)=>{
        res.setHeader('content-type', 'application/xml');
        var xml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
        xml += `<url><loc>${site}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;
        post.find({active:true}).select("url date")
        .then(doc=>{
            doc.forEach(i=>{
                var url=`${site}/${i.url}`;
                xml += `<url><loc>${url}</loc>`;
                xml += `<lastmod>${i.date.toISOString()}</lastmod><priority>0.7</priority></url>`;
            })

            tag.find().select("code")
            .then(tg=>{
                
                tg.forEach(i=>{
                    var url=`${site}/${i.code}`;
                    xml += `<url><loc>${url}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`;
                })
                xml += `</urlset>`;
                res.send(xml);
            })

           
        })
        
        .catch(err=>{
            throw err;
            next();
        })

    })
}