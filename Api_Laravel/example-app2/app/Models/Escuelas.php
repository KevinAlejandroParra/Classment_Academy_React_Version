<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Escuelas extends Model
{
    use HasFactory;

    protected $table = 'escuelas';
    protected $primaryKey = 'escuela_id';
    public $incrementing = false;
    protected $keyType = 'string';

    //proteger los campos de la tabla
    protected $fillable = [
        'escuela_id',
        'escuela_nombre',
        'escuela_nit',
        'escuela_descripcion',
        'escuela_telefono',
        'escuela_direccion',
        'escuela_correo',
        'escuela_password',
        'escuela_imagen_url',
        'escuela_estado',
    ];

    //ocultar password
    protected $hidden  = [
        'escuela_password',
    ];

    public $timestamps = true;

    public function admin_escuela(){
        return $this->belongsTo(User::class, 'escuela_correo', 'usuario_correo');
    }
}
