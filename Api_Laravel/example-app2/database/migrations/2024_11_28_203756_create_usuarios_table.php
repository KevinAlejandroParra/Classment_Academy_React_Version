<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->string('usuario_documento', 20)->primary();
            $table->enum('usuario_tipo_documento', ['CC', 'CE', 'TI', 'PPN', 'NIT', 'SSN', 'EIN']);
            $table->string('usuario_nombre', 100);
            $table->string('usuario_apellido', 100);
            $table->string('usuario_correo', 100)->unique();
            $table->string('usuario_password', 255);
            $table->string('usuario_telefono', 20)->nullable();
            $table->enum('rol', ['Estudiante', 'Admin_Escuela', 'Developer'])->default('Estudiante');
            $table->text('usuario_direccion')->nullable();
            $table->date('usuario_nacimiento');
            $table->string('usuario_imagen_url', 255)->default('../../PUBLIC/Img/usuarios/nf.jpg');
            $table->timestamp('usuario_fecha_creacion')->useCurrent();
            $table->timestamp('usuario_ultima_actualizacion')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('usuario_ultima_actualizacion')->useCurrent()->useCurrentOnUpdate();
            $table->enum('usuario_estado', ['activo', 'inactivo'])->default('activo');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
