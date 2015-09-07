module.exports.facebook = facebook;
module.exports.twitter = twitter;
module.exports.google = google;

function facebook(app)
{
	var FACEBOOK_APP_ID = _OAuth.facebook.appId;
	var FACEBOOK_APP_SECRET = _OAuth.facebook.secret;
	var FACEBOOK_APP_CALLBACK = _OAuth.facebook.callback + '/auth/facebook/callback';
	
	var passport = require('passport');

	app.use(passport.initialize());
//	app.use(passport.session());

	passport.serializeUser(function(user, done)
	{
		done(null, user);
	});
	passport.deserializeUser(function(obj, done)
	{
		done(null, obj);
	});

	var FacebookStrategy = require('passport-facebook').Strategy;
	passport.use(new FacebookStrategy({ clientID : FACEBOOK_APP_ID, clientSecret : FACEBOOK_APP_SECRET, callbackURL : FACEBOOK_APP_CALLBACK }, function(accessToken, refreshToken, profile, done)
	{
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// req.session.passport 정보를 저장하는 단계이다.
				// done 메소드에 전달된 정보가 세션에 저장된다.
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//
		profile.accessToken = accessToken;
		
		return done(null, profile);
	}));

	app.get('/auth/facebook', passport.authenticate('facebook'));
	//
	// redirect 실패/성공의 주소를 기입한다.
	//
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect : '/auth/login/success.auth', failureRedirect : '/auth/login/fail.do' }));
};

function twitter(app)
{
	var TWITTER_APP_ID = _OAuth.twitter.appId;
	var TWITTER_APP_SECRET = _OAuth.twitter.secret;
	var TWITTER_APP_CALLBACK = _OAuth.twitter.callback + '/auth/twitter/callback';
	
	var passport = require('passport');

	app.use(passport.initialize());
		
	passport.serializeUser(function(user, done)
	{
		done(null, user);
	});
	passport.deserializeUser(function(obj, done)
	{
		done(null, obj);
	});
	
	var TwitterStrategy = require('passport-twitter').Strategy;
	passport.use(new TwitterStrategy({consumerKey: TWITTER_APP_ID, consumerSecret: TWITTER_APP_SECRET, callbackURL: TWITTER_APP_CALLBACK}, function(token, tokenSecret, profile, done)
	{
	    //
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    // req.session.passport 정보를 저장하는 단계이다.
	    // done 메소드에 전달된 정보가 세션에 저장된다.
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    //
		return done(null, profile);
	}));
	
	app.get('/auth/twitter', passport.authenticate('twitter'));
	  //
	  // redirect 실패/성공의 주소를 기입한다.
	  //
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect : '/auth/login/success.auth', failureRedirect : '/auth/login/fail.do' }));
};

function google(app)
{
	var GOOGLE_APP_ID = _OAuth.google.appId;
	var GOOGLE_APP_SECRET = _OAuth.google.secret;
	var GOOGLE_APP_CALLBACK = _OAuth.google.callback + '/auth/google/callback';
	
	var passport = require('passport');

	app.use(passport.initialize());
		
	passport.serializeUser(function(user, done)
	{
		done(null, user);
	});
	passport.deserializeUser(function(obj, done)
	{
		done(null, obj);
	});
	
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
	passport.use(new GoogleStrategy({clientID: GOOGLE_APP_ID, clientSecret: GOOGLE_APP_SECRET, callbackURL: GOOGLE_APP_CALLBACK}, function(token, tokenSecret, profile, done)
	{
	    //
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    // req.session.passport 정보를 저장하는 단계이다.
	    // done 메소드에 전달된 정보가 세션에 저장된다.
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	    //
		return done(null, profile);
	}));
	
	app.get('/auth/google', passport.authenticate('google', {
	  scope: [
	    'https://www.googleapis.com/auth/userinfo.profile',
	    'https://www.googleapis.com/auth/userinfo.email'
	  ]
	}));
	
	app.get('/auth/google/callback', passport.authenticate('google', { successRedirect : '/auth/login/success.auth', failureRedirect : '/auth/login/fail.do' }));
};