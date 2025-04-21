const bcrypt = require('bcryptjs');
(async () => {
  try {
    const hash = await bcrypt.hash('test123', 10);
    console.log('Hash:', hash);
  } catch (err) {
    console.error('Hashing error:', err.message);
    console.error(err.stack);
  }
})();
