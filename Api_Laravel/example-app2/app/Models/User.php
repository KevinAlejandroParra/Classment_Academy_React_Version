<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $table = 'usuarios';

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
    
    protected $primaryKey = 'usuario_documento';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'usuario_password',
        'remember_token',
    ];

    public function getAuthPassword(){

        return $this->usuario_password;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'usuario_nacimiento' => 'date',
            'usuario_fecha_creacion' => 'datetime',
            'usuario_ultima_actualizacion' => 'datetime',
            'usuario_password' => 'hashed',
        ];
    }

    public function getJWTIdentifier(){
        return $this->getKey();
    }

    public function getJWTCustomClaims(){
        return [];
    }
}


