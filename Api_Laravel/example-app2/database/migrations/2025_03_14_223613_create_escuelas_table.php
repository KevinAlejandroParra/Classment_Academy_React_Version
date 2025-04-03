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
        Schema::create('escuelas', function (Blueprint $table) {
            $table->String('escuela_id', 20)->primary();
            $table->String('escuela_nombre', 100);
            $table->String('escuela_nit', 15);
            $table->text('escuela_descripcion');
            $table->String('escuela_telefono', 20);
            $table->String('escuela_direccion', 150);
            $table->String('escuela_correo', 100);
            $table->String('escuela_password', 255);
            $table->String('escuela_imagen_url', 255)->default('../../PUBLIC/Img/escuelas/nf.jpg');
            $table->timestamp('escuela_fecha_creacion')->useCurrent();
            $table->timestamp('escuela_ultima_actualizacion')->useCurrent()->onUpdate(DB::raw('CURRENT_TIMESTAMP'));
            $table->enum('escuela_estado', ['activo', 'inactivo'])->default('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escuelas');
    }
};
