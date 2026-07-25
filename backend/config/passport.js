// config/passport.js
import '../config/env.js'
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from '../models/auth/auth.js';
import { Strategy as GitHubStrategy } from "passport-github2";


//Google Login passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails[0].value;

        // 👇 Step 4 yahan aayega
        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email,
            provider: "google",
            googleId: profile.id,
            isVerified: true,
            avatar: profile.photos?.[0]?.value || "",
          });
        }

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);


//Github Login passport
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("GitHub email not found. Make sure your GitHub email is public."));
        }

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName || profile.username,
            email,
            provider: "github",
            githubId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
            isVerified: true,
          });
        }

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);



passport.use(
  "google-youtube",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.YOUTUBE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails[0].value;

        let user = await userModel.findOne({ email });

        // Agar user exist nahi karta to create kar do
        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email,
            provider: "google",
            googleId: profile.id,
            isVerified: true,
            avatar: profile.photos?.[0]?.value || "",
          });
        }

        // YouTube tokens bhi return kar do
        return done(null, {
          user,
          accessToken,
          refreshToken,
        });

      } catch (error) {
        return done(error, null);
      }
    }
  )
);






export default passport;