var express = require("express");
var app = express();
var mongoose = require("mongoose");
var multer = require('multer');
var cloudinary = require('cloudinary');
var Article = require("./models/articles");
var Email = require("./models/emails");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var sendgridTransport = require("nodemailer-sendgrid-transport");
var Booked = require("./models/booked")
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/users");
var expressSession = require("express-session");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var Offer = require("./models/offer");
var flash = require("connect-flash");
var crypto = require("crypto");
const { DateTime } = require("luxon");
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRIDAPI)
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    accessKeyId:"AKIAJULIZKMV3MDTRI6Q",
secretAccessKey:"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",
    region: 'us-east-1'
});




app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(expressSession({
    secret:"Emad's blog",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});




mongoose.connect("mongodb+srv://EmadHassan:emad1987emad@articles.onsmy.mongodb.net/prime?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
cloudinary.config({ 
    cloud_name: 'dp3abctzf', 
    api_key: "977678664345788", 
    api_secret: "diAlXivHgY5cQTaDl1H-JhdDCvc"
  });
  var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
  var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var limitOption =
    {fieldSize: 1000000000, fileSize: 1000000000};
var upload = multer({ storage: storage, limits:limitOption, fileFilter:imageFilter});





app.get("/", function(req, res){
    Offer.findOne({}, function(error, offer){
        if(error){
            req.flash("error", error.message);
            res.render("home");
        }
        else {
            res.render("home", {offer:offer});
        }
    })
});

// app.get("/articles", function(req, res){
//     Article.find({}, function(err, allArticles){
//         if(err){
//             req.flash("error", err.message);
//             res.redirect("back");
//         }
//         else{
            
//             res.render("articles", {articles: allArticles});
//         }
//     });
// });

// app.get("/articles/new", isLoggedIn, function(req, res){
//     res.render("new");
// });

// app.post("/articles", isLoggedIn, upload.single("image"), function(req, res){
//      cloudinary.v2.uploader.upload(req.file.path, {invalidate: true}, function(err, result) {
//     if(err){
//         req.flash("error", error.message);
//         res.redirect("/")        
//     }else {
//           // add cloudinary url for the image to the campground object under image property
//   req.body.image = result.secure_url;
//   req.body.imageId = result.public_id;
//   req.body.title = req.sanitize(req.body.title)
//   req.body.body = req.sanitize(req.body.body)  
//   Article.create(req.body, function(err, article) {
//     if (err) {
//       req.flash('error', err.message);
//       return res.redirect('back');
//     }
//     res.redirect("/articles");
//   });
//     }

// });

// });

// app.get("/articles/:id", function(req, res) {
//     Article.findById(req.params.id, function(err, foundArticle){
//         if(err){
//             console.log(err);
//             req.flash("error", err.message);
//             res.redirect("back");
//         }
//         else{
//             res.render("show", {article:foundArticle});
//         }
//     });
// });


// app.delete('/articles/:id', isLoggedIn, function(req, res) {
//     Article.findById(req.params.id, async function(err, article) {
//       if(err) {
//         req.flash("error", err.message);
//         return res.redirect("back");
//       }
//       try {
//           await cloudinary.v2.uploader.destroy(article.imageId, {invalidate:true});
//           article.remove();
//           req.flash('success', 'Article is deleted successfully!');
//           res.redirect('/articles');
//       } catch(err) {
//           if(err) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//           }
//       }
//     });
//   });

  app.get("/about", function(req, res){
      res.render("about");
  })

//   app.get("/team", function(req, res){
//     res.render("team");
// })

app.get("/services/endo", function(req, res){
    res.render("endo");
})

app.get("/services/veneers", function(req, res){
    res.render("veneers")
})

app.get("/services/whitening", function(req, res){
    res.render("whitening");
})

app.get("/services/crown", function(req, res){
    res.render("crown");
})

app.get("/services/implant", function(req, res){
    res.render("implant");
})

app.get("/services/ortho", function(req, res){
    res.render("ortho");
})

app.get("/services/pedo", function(req, res){
    res.render("pedo");
})

app.post("/subscribe", function(req, res){
    req.body.email = req.sanitize(req.body.email)
    Email.find({email:req.body.email}, function(err, foundEmail){
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
          }
        else if (foundEmail.length > 0){
            req.flash("error", "This Email has already subscribed");
            res.redirect("/")
        }
        else {
            req.body.email = req.sanitize(req.body.email);
            Email.create(req.body, function(error, email) {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
                req.flash("success", "You subscribed successfully");                
                res.redirect("/");
              });
        }
    })
    
})

app.get("/unsubscribe", function(req, res){
    res.render("unsubscribe");
})

app.post("/unsubscribe", function(req, res){
    req.body.email = req.sanitize(req.body.email);
    
    Email.deleteOne({email: req.body.email}, function(error){
        if (error){
            req.flash("error", error.message);
            res.redirect("/unsubscribe")
        }else {
            req.flash("success", "You unsubscribed successfully");
            res.redirect("/");
        }
    })
})

app.get("/contact", function(req, res){
    res.render("contact")
})


app.get("/admin", isLoggedIn, function(req, res){
    Booked.find({}, function(error, booked){
        if(error){
            req.flash("error", error.message);
            res.redirect("back")
        }
        else {
            res.render("admin", {booked:booked})
        }
    })
})

app.post("/admin", isLoggedIn, upload.single("image"), function(req, res){
    cloudinary.v2.uploader.upload(req.file.path, {invalidate: true}, function(err, result){
        if(err) {
            req.flash("error", err.message);
            res.redirect("/admin");
        }
        else {
            req.body.subject = req.sanitize(req.body.subject)
            // req.body.message = req.sanitize(req.body.message)
            Email.find({}, function(error, docs){
                if(error){
                    req.flash("error", error.message);
                    res.redirect("back");
                }
                else {
                    const map = docs.map(doc => doc.email);
                    const emails = map.join();
                    const transporter = nodemailer.createTransport(sendgridTransport({
                        auth:{
                            api_key:process.env.SENDGRIDAPI
                        }
                    }))
                
                    var mailOptions = {
                      to: emails,
                      from:"clinic@primedentalcare.org",
                      subject: req.body.subject,
                      html:
                      "<div><img style='max-width: 300px;' src='" + result.secure_url + "'></div>" + "\n\n" +
                      req.body.message + "\n\n" +
                      "<p>You're receiving this email because you're a valued member of prime dental care clinic.To stop receiving emails , please click the link below</p>" + "\n\n" + 
                      "<a href='https://ancient-woodland-15359.herokuapp.com/unsubscribe'>Click here to unsubscribe</a>"
                    };
                
                    transporter.sendMail(mailOptions, function(errr) {
                      if(errr){
                        req.flash("error", errr.message);
                        res.redirect("back");
                      }
                      else {
                          req.flash("success", "A message has been sent to all subscribed emails")
                          res.redirect("/admin");
                      }
                
                
                    });
        
                }
            })
        }
        
    })
    
    
});

app.post("/book", function(req, res){
    req.body.name = req.sanitize(req.body.name);
    req.body.phone = req.sanitize(req.body.phone);
    req.body.email = req.sanitize(req.body.email);
    req.body.date = Date.now() + 7200000
    Booked.create(req.body, function(error, booked){
        if(error){
            req.flash("error", error.message);
            res.redirect("back");
        }
        else {
            Email.find({email:req.body.email}, function(error, foundEmail){
                if(error){
                    req.flash("error", error.message);
                    res.redirect("back");
                }
                else {
                    req.flash("success", "Your booking information has been sent, Please wait for our phone call");
                    res.redirect("/");
                }
            })
        }
    })
})

app.get("/register", function(req, res){
    res.render("register"); 
 });
 
 app.post("/register", function(req, res){
   req.body.username = req.sanitize(req.body.username)
   req.body.email = req.sanitize(req.body.email)
   req.body.password = req.sanitize(req.body.password)
   req.body.secret = req.sanitize(req.body.secret)
   if (req.body.secret === process.env.SECRET){
    User.register(User({username:req.body.username, email:req.body.email}), req.body.password, function(err, account){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "You registered successfully")
                res.redirect("/");
            });
        }
    });
   } else {
       req.flash("error", "Wrong Secret Word");    
       res.redirect("/");
   }
     
 });

 app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login",passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash: "You are logged in successfully",
    failureFlash: true
}), function(req, res){
    
});

app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You logged out successfully")
    res.redirect("/");
 });

 app.post("/offer", isLoggedIn, function(req, res){
     req.body.text = req.sanitize(req.body.text)
     Offer.findOneAndUpdate({}, req.body, function(error, offer){
         if(error){
            req.flash("error", error.message);
            res.redirect("/admin")
         }
         else {
            req.flash("success", "The offer option is changed")
            res.redirect("/");
         }
     })
 })

app.get("/contact", function(req, res){
   res.render("contact");
});

 app.post("/contact" ,function(req, res){
     req.body.name = req.sanitize(req.body.name);
     req.body.email = req.sanitize(req.body.email);
     req.body.phone = req.sanitize(req.body.phone);
     req.body.subject = req.sanitize(req.body.subject);
     req.body.message = req.sanitize(req.body.message);
//      const transporter = nodemailer.createTransport(sendgridTransport({
//         auth:{
//             api_key:process.env.SENDGRIDAPI
//         }
//     }))

//     var mailOptions = {
//       to: "approvals@primedentalcare.org",
//       from: "clinic@primedentalcare.org",
//       subject: req.body.subject,
//       text: "Name: " + req.body.name + "\n\n" +
//             "Phone: " + req.body.phone + "\n\n" +
//             "Email: " + req.body.email + "\n\n" +
//             req.body.message
//     };

//     transporter.sendMail(mailOptions, function(err) {
//       if(err){
//         req.flash("error", err.message);
//         res.redirect("back");
//       }
//       else {
//           req.flash("success", "Your message has been sent, Please wait for our email message")
//           res.redirect("/");
//       }


//     });



// const msg = {
//   to: 'clinic@primedentalcare.org',
//   from: 'clinic@primedentalcare.org',
//   subject: req.body.subject,
//   text: "Name: " + req.body.name + "\n\n" +
//         "Phone: " + req.body.phone + "\n\n" +
//         "Email: " + req.body.email + "\n\n" +
//         req.body.message
// }

// sgMail
//   .send(msg)
//   .then(() => {
//         req.flash("success", "Your message has been sent, Please wait for our email message")
//         res.redirect("/");   
//   })
//   .catch((error) => {
//         req.flash("error", error.message);
//         res.redirect("back");
//   })

var params = {
    Destination: { /* required */
      CcAddresses: [req.body.email],
      ToAddresses: ["clinic@primedentalcare.org"]
    },
    Message: { /* required */
      Body: { /* required */
        Text: {
         Charset: "UTF-8",
         Data: "Name: " + req.body.name + "\n\n" +
                 "Phone: " + req.body.phone + "\n\n" +
                 "Email: " + req.body.email + "\n\n" +
                 req.body.message
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: req.body.subject
       }
      },
    Source: 'clinic@primedentalcare.org', /* required */
    ReplyToAddresses: ["clinic@primedentalcare.org"],
  };
  
  // Create the promise and SES service object
  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
        req.flash("success", "Your message has been sent, Please wait for our email message")
        res.redirect("/");
    }).catch(
      function(err) {
        req.flash("error", err.message);
        res.redirect("back");
    });

 })

 app.delete("/admin/deleteAll", isLoggedIn, function(req, res){
        Booked.deleteMany({}, function(error){
            if(error){
                req.flash("error", error.message);
                res.redirect("/admin");
            }
            else {
                req.flash("success", "All online appointments are deleted...")
                res.redirect("/admin");
            }
        })
 })

  app.delete("/admin/:id", isLoggedIn, function(req, res){
      Booked.findByIdAndDelete(req.params.id, function(error){
          if(error){
              req.flash("error", error.message);
              res.redirect("/admin");
          }else {
              req.flash("success", "An onile appointment is deleted")
              res.redirect("/admin");
          }
      })
  });

  app.get("/login/email", function(req, res){
      res.render("email");
  })

  app.post('/login/email', function(req, res, next) {
    req.body.email = req.sanitize(req.body.email);
    
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (err || !user) {
            req.flash('error', 'No account with that email address exists');
            return res.redirect('/login/email');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport(sendgridTransport({
            auth:{
                api_key:process.env.SENDGRIDAPI
            }
        }))

        var mailOptions = {
          to: user.email,
          from: 'approvals@primedentalcare.org',
          subject: 'Prime Dental Care/Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        //   res.redirect('/');          
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/login/email');
    });
  });

  app.get("/reset/:token" , function(req, res){
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
if (err || !user) {
 req.flash('error', 'Password reset token is invalid or has expired.');
 return res.redirect('/login/email');
}
res.render('newPassword', {token: req.params.token});
});
});

app.get("/reset/:token" , function(req, res){
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
if (err || !user) {
 req.flash('error', 'Password reset token is invalid or has expired.');
 return res.redirect('/login/email');
}
res.render('newPassword', {token: req.params.token});
});
});

app.post('/reset/:token', function(req, res) {
    req.body.password = req.sanitize(req.body.password);
    req.body.confirm = req.sanitize(req.body.confirm);
    
    
async.waterfall([
function(done) {
 User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
   if (err || !user) {
     req.flash('error', 'Password reset token is invalid or has expired.');
     return res.redirect('back');
   }
   if(req.body.password === req.body.confirm) {
     user.setPassword(req.body.password, function(err) {
       user.resetPasswordToken = undefined;
       user.resetPasswordExpires = undefined;

       user.save(function(err) {
         req.logIn(user, function(err) {
           done(err, user);
         });
       });
     });
   } else {
       req.flash("error", "Passwords do not match.");
       return res.redirect('back');
   }
 });
},
function(user, done) {
 var smtpTransport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.SENDGRIDAPI
    }
}))
 var mailOptions = {
   to: user.email,
   from: 'approvals@primedentalcare.org',
   subject: 'Your password has been changed',
   text: 'Hello,\n\n' +
     'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
 };
 smtpTransport.sendMail(mailOptions, function(err) {
   req.flash('success', 'Your password has been changed.');
   done(err);
 });
}
], function(err) {
 if(err){
     console.log(err);
 }else{
        res.redirect('/');
     
 }
});
});

 function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
   }




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});

// app.listen(3000);

