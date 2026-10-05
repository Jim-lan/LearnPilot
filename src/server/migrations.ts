export type Migration = { version: number; name: string; sql: string };

export const migrations: Migration[] = [
  {
    version: 1,
    name: "foundation",
    sql: `
      CREATE TABLE students (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        environment TEXT NOT NULL CHECK (environment IN ('synthetic_demo', 'real')),
        course_id TEXT,
        unit_id TEXT,
        goal TEXT,
        minutes_available INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE content_packs (
        id TEXT NOT NULL,
        version TEXT NOT NULL,
        title TEXT NOT NULL,
        jurisdiction TEXT,
        course_code TEXT,
        curriculum_version TEXT,
        rights_status TEXT NOT NULL,
        review_status TEXT NOT NULL,
        source_url TEXT,
        imported_at TEXT NOT NULL,
        PRIMARY KEY (id, version)
      ) STRICT;
      CREATE TABLE concepts (
        id TEXT NOT NULL,
        pack_id TEXT NOT NULL,
        pack_version TEXT NOT NULL,
        title TEXT NOT NULL,
        original_explanation TEXT NOT NULL,
        prerequisite_ids TEXT NOT NULL DEFAULT '[]',
        mapping_status TEXT NOT NULL,
        PRIMARY KEY (id, pack_id, pack_version),
        FOREIGN KEY (pack_id, pack_version) REFERENCES content_packs(id, version)
      ) STRICT;
      CREATE TABLE resources (
        id TEXT PRIMARY KEY,
        pack_id TEXT NOT NULL,
        pack_version TEXT NOT NULL,
        concept_id TEXT NOT NULL,
        provider TEXT NOT NULL,
        url TEXT,
        purpose TEXT NOT NULL,
        review_status TEXT NOT NULL,
        availability TEXT NOT NULL,
        fallback_text TEXT NOT NULL,
        FOREIGN KEY (concept_id, pack_id, pack_version) REFERENCES concepts(id, pack_id, pack_version)
      ) STRICT;
      CREATE TABLE items (
        id TEXT NOT NULL,
        version INTEGER NOT NULL CHECK (version > 0),
        pack_id TEXT NOT NULL,
        pack_version TEXT NOT NULL,
        concept_id TEXT NOT NULL,
        prompt TEXT NOT NULL,
        answer_kind TEXT NOT NULL,
        answer_json TEXT NOT NULL,
        rubric TEXT NOT NULL,
        mode TEXT NOT NULL CHECK (mode IN ('practice', 'reassessment')),
        review_status TEXT NOT NULL,
        PRIMARY KEY (id, version),
        FOREIGN KEY (concept_id, pack_id, pack_version) REFERENCES concepts(id, pack_id, pack_version)
      ) STRICT;
      CREATE TABLE coverage_observations (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        concept_id TEXT NOT NULL,
        state TEXT NOT NULL CHECK (state IN ('unknown', 'not_yet', 'in_progress', 'covered')),
        origin TEXT NOT NULL,
        observed_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE evidence (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        source_type TEXT NOT NULL,
        source_file_id TEXT,
        status TEXT NOT NULL,
        current_revision_id TEXT,
        created_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE evidence_revisions (
        id TEXT PRIMARY KEY,
        evidence_id TEXT NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
        revision_number INTEGER NOT NULL,
        concept_id TEXT NOT NULL,
        response TEXT NOT NULL,
        mark TEXT,
        mark_origin TEXT NOT NULL,
        assistance_status TEXT NOT NULL CHECK (assistance_status IN ('known_none', 'recorded_assisted', 'unknown')),
        source_locator TEXT,
        reviewer TEXT,
        review_status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE (evidence_id, revision_number)
      ) STRICT;
      CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        mode TEXT NOT NULL CHECK (mode IN ('practice', 'reassessment')),
        started_at TEXT NOT NULL,
        ended_at TEXT
      ) STRICT;
      CREATE TABLE attempts (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        session_id TEXT REFERENCES sessions(id),
        item_id TEXT NOT NULL,
        item_version INTEGER NOT NULL,
        answer TEXT NOT NULL,
        score_status TEXT NOT NULL,
        score_value INTEGER,
        assistance_status TEXT NOT NULL CHECK (assistance_status IN ('known_none', 'recorded_assisted', 'unknown')),
        prior_exposure INTEGER NOT NULL CHECK (prior_exposure IN (0, 1)),
        idempotency_key TEXT NOT NULL,
        submitted_at TEXT NOT NULL,
        FOREIGN KEY (item_id, item_version) REFERENCES items(id, version),
        UNIQUE (student_id, idempotency_key)
      ) STRICT;
      CREATE TABLE assistance_events (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        item_id TEXT NOT NULL,
        item_version INTEGER NOT NULL,
        session_id TEXT REFERENCES sessions(id),
        kind TEXT NOT NULL CHECK (kind IN ('presented', 'hint', 'solution', 'reported_external')),
        happened_at TEXT NOT NULL,
        FOREIGN KEY (item_id, item_version) REFERENCES items(id, version)
      ) STRICT;
      CREATE TABLE learning_summaries (
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        concept_id TEXT NOT NULL,
        policy_version TEXT NOT NULL,
        evidence_refs_json TEXT NOT NULL,
        coverage TEXT NOT NULL,
        observed_result TEXT NOT NULL,
        assistance TEXT NOT NULL,
        sufficiency TEXT NOT NULL,
        review_due_at TEXT,
        dirty INTEGER NOT NULL DEFAULT 0 CHECK (dirty IN (0, 1)),
        updated_at TEXT NOT NULL,
        PRIMARY KEY (student_id, concept_id)
      ) STRICT;
      CREATE TABLE operations (
        id TEXT PRIMARY KEY,
        student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        input_refs_json TEXT NOT NULL,
        model_version TEXT,
        schema_version TEXT NOT NULL,
        retry_count INTEGER NOT NULL DEFAULT 0,
        error_code TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX attempts_student_time ON attempts(student_id, submitted_at);
      CREATE INDEX revisions_evidence ON evidence_revisions(evidence_id, revision_number);
      CREATE INDEX events_student_item ON assistance_events(student_id, item_id, happened_at);
    `,
  },
  {
    version: 2,
    name: "learning_loop_fields",
    sql: `
      CREATE TABLE expectation_refs (
        id TEXT NOT NULL,
        pack_id TEXT NOT NULL,
        pack_version TEXT NOT NULL,
        jurisdiction TEXT NOT NULL,
        course_code TEXT NOT NULL,
        curriculum_version TEXT NOT NULL,
        expectation_code TEXT NOT NULL,
        source_url TEXT NOT NULL,
        source_locator TEXT,
        wording_status TEXT NOT NULL,
        PRIMARY KEY (id, pack_id, pack_version),
        UNIQUE (jurisdiction, course_code, curriculum_version, expectation_code, pack_id, pack_version),
        FOREIGN KEY (pack_id, pack_version) REFERENCES content_packs(id, version)
      ) STRICT;
      CREATE TABLE concept_mappings (
        concept_id TEXT NOT NULL,
        expectation_id TEXT NOT NULL,
        pack_id TEXT NOT NULL,
        pack_version TEXT NOT NULL,
        review_status TEXT NOT NULL,
        review_method TEXT NOT NULL,
        PRIMARY KEY (concept_id, expectation_id, pack_id, pack_version),
        FOREIGN KEY (concept_id, pack_id, pack_version) REFERENCES concepts(id, pack_id, pack_version),
        FOREIGN KEY (expectation_id, pack_id, pack_version) REFERENCES expectation_refs(id, pack_id, pack_version)
      ) STRICT;
      ALTER TABLE resources ADD COLUMN format TEXT NOT NULL DEFAULT 'text';
      ALTER TABLE resources ADD COLUMN language TEXT NOT NULL DEFAULT 'en';
      ALTER TABLE resources ADD COLUMN accessibility_notes TEXT;
      ALTER TABLE resources ADD COLUMN reviewed_at TEXT;
      ALTER TABLE resources ADD COLUMN available_checked_at TEXT;
      ALTER TABLE items ADD COLUMN hint TEXT NOT NULL DEFAULT '';
      ALTER TABLE items ADD COLUMN validation_note TEXT NOT NULL DEFAULT '';
      ALTER TABLE students ADD COLUMN preferred_format TEXT NOT NULL DEFAULT 'read';
      ALTER TABLE students ADD COLUMN language TEXT NOT NULL DEFAULT 'en';
      ALTER TABLE students ADD COLUMN assessment_date TEXT;
      ALTER TABLE attempts ADD COLUMN feedback_text TEXT;
      ALTER TABLE attempts ADD COLUMN score_source TEXT;
      CREATE TABLE study_plans (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        concept_id TEXT NOT NULL,
        pack_id TEXT NOT NULL,
        pack_version TEXT NOT NULL,
        reason TEXT NOT NULL,
        attention_prompt TEXT NOT NULL,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL
      ) STRICT;
      CREATE TABLE resource_events (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        resource_id TEXT NOT NULL REFERENCES resources(id),
        kind TEXT NOT NULL CHECK (kind IN ('offered', 'opened', 'reported_complete', 'reported_helpful')),
        happened_at TEXT NOT NULL
      ) STRICT;
    `,
  },
  {
    version: 3,
    name: "pack_integrity",
    sql: "ALTER TABLE content_packs ADD COLUMN digest TEXT;",
  },
  {
    version: 4,
    name: "manual_evidence_fields",
    sql: `
      ALTER TABLE evidence ADD COLUMN source_description TEXT;
      ALTER TABLE evidence_revisions ADD COLUMN question_text TEXT;
      ALTER TABLE evidence_revisions ADD COLUMN teacher_mark TEXT;
    `,
  },
  {
    version: 5,
    name: "evidence_correction_lineage",
    sql: `
      ALTER TABLE evidence_revisions ADD COLUMN supersedes_revision_id TEXT;
      ALTER TABLE evidence_revisions ADD COLUMN correction_reason TEXT;
    `,
  },
  {
    version: 6,
    name: "session_plan_dependency",
    sql: "ALTER TABLE sessions ADD COLUMN plan_id TEXT REFERENCES study_plans(id);",
  },
  {
    version: 7,
    name: "plan_provenance",
    sql: `
      ALTER TABLE study_plans ADD COLUMN evidence_refs_json TEXT NOT NULL DEFAULT '[]';
      ALTER TABLE study_plans ADD COLUMN policy_version TEXT NOT NULL DEFAULT 'descriptive-0.1';
      ALTER TABLE study_plans ADD COLUMN resource_id TEXT REFERENCES resources(id);
    `,
  },
  {
    version: 8,
    name: "encouragement_points",
    sql: `
      CREATE TABLE reward_awards (
        attempt_id TEXT PRIMARY KEY REFERENCES attempts(id) ON DELETE CASCADE,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        item_id TEXT NOT NULL,
        item_version INTEGER NOT NULL,
        points INTEGER NOT NULL CHECK (points = 10),
        policy_version TEXT NOT NULL,
        awarded_at TEXT NOT NULL,
        FOREIGN KEY (item_id, item_version) REFERENCES items(id, version),
        UNIQUE (student_id, item_id, item_version)
      ) STRICT;
      INSERT INTO reward_awards (attempt_id, student_id, item_id, item_version, points, policy_version, awarded_at)
      SELECT id, student_id, item_id, item_version, 10, 'correct-answer-v1', submitted_at FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY student_id, item_id, item_version ORDER BY submitted_at, rowid) AS position
        FROM attempts WHERE score_status = 'correct' AND score_source = 'deterministic-v0.1'
      ) WHERE position = 1;
    `,
  },
];
