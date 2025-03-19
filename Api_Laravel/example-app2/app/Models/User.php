<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    public $timestamps = false;

    protected $table = 'usuarios';
    protected $primaryKey = 'usuario_documento';
    
    protected $fillable = [
        'usuario_documento',
        'usuario_tipo_documento',
        'usuario_nombre',
        'usuario_apellido',
        'usuario_correo',
        'usuario_password',
        'usuario_telefono',
        'usuario_direccion',
        'usuario_nacimiento',
        'usuario_imagen_url',
        'usuario_fecha_creacion',
        'usuario_ultima_actualizacion',
        'usuario_estado',
    ];

    protected $hidden = [
        'usuario_password',
        'remember_token',
    ];

    //devolver el campo correcto de contraseña
    public function getAuthPassword()
    {
        return $this->usuario_password;
    }

    public function getAuthIdentifier()
    {
        return $this->{$this->getAuthIdentifierName()};
    }

    public function getAuthIdentifierName()
    {
        return 'usuario_correo';
    }

    // Corrección en los casts
    protected $casts = [
        'usuario_nacimiento' => 'date',
        'usuario_fecha_creacion' => 'datetime',
        'usuario_ultima_actualizacion' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function escuela()
    {
        return $this->hasOne(Escuelas::class, 'escuela_correo', 'usuario_correo');
    }
}
