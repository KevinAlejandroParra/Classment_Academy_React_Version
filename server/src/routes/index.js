const teacherRoutes = require('./teacher.routes');

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/teachers', teacherRoutes); 