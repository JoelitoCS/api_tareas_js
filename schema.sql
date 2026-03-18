-- ============================================================
--  SCHEMA COMPLETO PARA SUPABASE
--  Ejecuta este SQL en: Supabase → SQL Editor → New Query
-- ============================================================

-- ─── Enums ──────────────────────────────────────────────────────────────────
CREATE TYPE ciclo_formativo AS ENUM ('DAW', 'DAM', 'ASIR', 'SMR');
CREATE TYPE rol_usuario AS ENUM ('estudiante', 'administrador');
CREATE TYPE estado_modulo AS ENUM ('aprobado', 'cursando', 'no-cursa', 'pendiente');
CREATE TYPE estado_tarea AS ENUM ('pendiente', 'en-progreso', 'completada');

-- ─── Tabla: usuarios ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           TEXT NOT NULL,
  email            TEXT NOT NULL UNIQUE,
  password_hash    TEXT NOT NULL,
  ciclo_formativo  ciclo_formativo NOT NULL,
  rol              rol_usuario NOT NULL DEFAULT 'estudiante',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Tabla: modulos ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modulos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           TEXT NOT NULL,
  curso            SMALLINT NOT NULL CHECK (curso IN (1, 2)),
  ciclo_formativo  ciclo_formativo NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Tabla: modulos_estudiantes ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modulos_estudiantes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id           UUID NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
  estudiante_id       UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  estado              estado_modulo NOT NULL DEFAULT 'cursando',
  nota_trimestre1     NUMERIC(4,2) CHECK (nota_trimestre1 >= 0 AND nota_trimestre1 <= 10),
  nota_trimestre2     NUMERIC(4,2) CHECK (nota_trimestre2 >= 0 AND nota_trimestre2 <= 10),
  nota_trimestre3     NUMERIC(4,2) CHECK (nota_trimestre3 >= 0 AND nota_trimestre3 <= 10),
  nota_ordinaria      NUMERIC(4,2) CHECK (nota_ordinaria >= 0 AND nota_ordinaria <= 10),
  nota_extraordinaria NUMERIC(4,2) CHECK (nota_extraordinaria >= 0 AND nota_extraordinaria <= 10),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (modulo_id, estudiante_id)
);

-- ─── Tabla: tareas ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tareas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id         UUID NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
  estudiante_id     UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo            TEXT NOT NULL,
  descripcion       TEXT NOT NULL DEFAULT '',
  fecha_creacion    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_vencimiento TIMESTAMPTZ,
  estado            estado_tarea NOT NULL DEFAULT 'pendiente',
  nota              NUMERIC(4,2) CHECK (nota >= 0 AND nota <= 10),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Índices ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_modulos_ciclo     ON modulos(ciclo_formativo);
CREATE INDEX IF NOT EXISTS idx_me_estudiante     ON modulos_estudiantes(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_me_modulo         ON modulos_estudiantes(modulo_id);
CREATE INDEX IF NOT EXISTS idx_tareas_modulo     ON tareas(modulo_id);
CREATE INDEX IF NOT EXISTS idx_tareas_estudiante ON tareas(estudiante_id);

-- ─── Row Level Security (desactivado — la API gestiona la autenticación) ────
ALTER TABLE usuarios            DISABLE ROW LEVEL SECURITY;
ALTER TABLE modulos             DISABLE ROW LEVEL SECURITY;
ALTER TABLE modulos_estudiantes DISABLE ROW LEVEL SECURITY;
ALTER TABLE tareas              DISABLE ROW LEVEL SECURITY;
