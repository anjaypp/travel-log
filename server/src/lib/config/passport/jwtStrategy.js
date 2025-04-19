import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import User from "../../../models/User.model.js";
import config from "../config.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET || "secret",
};

  const jwtStrategy = (new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default jwtStrategy;
