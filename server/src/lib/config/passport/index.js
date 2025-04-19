import passport from 'passport';
import jwtStrategy from './jwtStrategy.js';

passport.use(jwtStrategy);

export default passport;
