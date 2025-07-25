INSERT INTO users (name, email, password) VALUES (
  'Alfan Jauhari',
  'hi@alfanjauhari.com',
  -- 'password' hashed with argon2id
  '$argon2id$v=19$m=65536,t=2,p=1$jGy/gV9FC1+1r6L6xDif74Qg2dweMdXryfaLsNvnP/8$36NzXYtUoVi/SczWAmpx1hHqbzXu9xUQSSyrHlLSaK4'
)