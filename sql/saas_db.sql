CREATE EXTENSION if not exists "uuid-ossp";

-- ** Tenant dependencies **
-- Tenant Industries
CREATE TABLE if not exists  public.industry (
	id serial4 NOT NULL,
	code varchar(20) NOT NULL, -- retail, health
  "name" varchar(50) NOT NULL,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- Tenant/BusinessPartner Identification Types
CREATE TABLE if not exists  public.identification_type (
	id serial4 NOT NULL,
	code varchar(20) NOT NULL, -- passport, driver_license, tax_id, cedula
  "name" varchar(250) NOT NULL,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- ** Tenant **
CREATE TABLE if not exists  public.tenant (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
  identification_type_id int4 NOT NULL,
	identification_number varchar(255) NOT NULL,
	code varchar(50) NOT NULL,
  business_name varchar(255) NOT NULL,
	email varchar(255) NULL,
	phone varchar(50) NULL,
	industry_id int4 NULL,
	active bool DEFAULT true NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	UNIQUE (code),
	PRIMARY KEY (id),
	FOREIGN KEY (identification_type_id) REFERENCES public.identification_type(id) ON DELETE CASCADE,
	FOREIGN KEY (industry_id) REFERENCES public.industry(id) ON DELETE CASCADE,
  UNIQUE (identification_number, identification_type_id)
);

-- ** BusinessUnit **
CREATE TABLE if not exists  public.business_unit (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	tenant_id uuid NOT NULL,
	code varchar(50) NOT NULL,
  business_name varchar(255) NOT NULL,
	email varchar(255) NULL,
	phone varchar(50) NULL,
	address text NULL,
	active bool DEFAULT true NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	removed_at timestamptz NULL,
	removed_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX uq_business_unit
ON public.business_unit (tenant_id, code, removed_at) 
NULLS NOT DISTINCT;

-- ** BusinessPartner **
CREATE TABLE if not exists  public.business_partner (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	tenant_id uuid NOT NULL,
  identification_type_id int4 NOT NULL,
  identification_number varchar(255) NOT NULL,
  first_name varchar(100) NULL,
	last_name varchar(100) NULL,
	email varchar(255) NULL,
	phone varchar(50) NULL,
	address text NULL,
	is_customer bool DEFAULT false NOT NULL,
	is_agent bool DEFAULT false NOT NULL,
	active bool DEFAULT true NOT NULL,
	extra_data jsonb NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	removed_at timestamptz NULL,
	removed_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (identification_type_id) REFERENCES public.identification_type(id) ON DELETE CASCADE,
	FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX uq_business_partner
ON public.business_partner (tenant_id, identification_number, identification_type_id, removed_at) 
NULLS NOT DISTINCT;

-- ** Catalog tables **
create table product_category_type(
	id serial4 NOT NULL,
	code varchar(20) NOT NULL, -- product, service
  "name" varchar(50) NOT NULL,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- product_category: e.g. Electronics, Furniture, etc.
CREATE TABLE if not exists  public.product_category (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	tenant_id uuid NOT NULL,
	product_category_type_id int4 NOT NULL,
	code varchar(50) NOT NULL,
  "name" varchar(100) NOT NULL,
	active bool DEFAULT true NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	removed_at timestamptz NULL,
	removed_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE,
	FOREIGN KEY (product_category_type_id) REFERENCES public.product_category_type(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX uq_product_category
ON public.product_category (tenant_id, code, removed_at) 
NULLS NOT DISTINCT;

-- product: e.g. TV, Sofa, etc. (linked to category)
CREATE TABLE if not exists  public.product (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	tenant_id uuid NOT NULL,
	product_category_id uuid NOT NULL,
	code varchar(100) NOT NULL,
  "name" varchar(255) NOT NULL,
	base_price numeric(15, 2) not null default 0,
	base_cost numeric(15, 2) not null default 0,
	active bool DEFAULT true NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	removed_at timestamptz NULL,
	removed_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (product_category_id) REFERENCES public.product_category(id) ON DELETE CASCADE,
	FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX uq_product
ON public.product (tenant_id, code, removed_at) 
NULLS NOT DISTINCT;

-- product_business_unit: linking products to business units with specific price, cost and stock
CREATE TABLE if not exists  public.product_business_unit (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	product_id uuid NOT NULL,
	business_unit_id uuid NOT NULL,
	price numeric(15, 2) not null default 0,
	"cost" numeric(15, 2) not null default 0,
	stock numeric(15, 3) DEFAULT 0 NOT NULL,
	active bool DEFAULT true NOT NULL,
  extra_data jsonb NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (business_unit_id) REFERENCES public.business_unit(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE,
  UNIQUE (product_id, business_unit_id)
);

-- ** Work-Flow/Status-Flow tables **
-- document_status: e.g. draft, pending, scheduled, in_progress, completed, cancelled, voided.
CREATE TABLE if not exists  public.document_status (
	id serial4 NOT NULL,
	code varchar(20) NOT NULL,
  "name" varchar(50) NOT NULL,
	is_editable bool DEFAULT false not NULL,
	is_final bool DEFAULT false not NULL,
	is_posted bool DEFAULT false not NULL,
	UNIQUE (code),
	PRIMARY KEY (id)
);

CREATE TABLE if not exists  public.document_action (
  id serial4 NOT NULL,
  code varchar(50) NOT NULL, -- confirm(draft->pending), schedule(pending->scheduled), start(scheduled->in_progress), complete(in_progress->completed), cancel(any->cancelled), void(completed->voided).
  "name" varchar(100) NOT NULL,
  UNIQUE (code),
  PRIMARY KEY (id)
);

-- movement_type: e.g. output, internal, input (linked to document_type)
CREATE TABLE if not exists  public.movement_type (
	id serial4 NOT NULL,
	code varchar(20) NOT NULL, -- out, internal, in
  "name" varchar(250) NOT NULL,
  sign int2 NOT NULL, -- -1 for output, 0 for internal, 1 for input
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- document_type: e.g. SalesOrder (out), PurchaseOrder(in), Invoice(out), ReceiptNote(in), etc. (linked to movement_type)
CREATE TABLE if not exists  public.document_type (
	id serial4 NOT NULL,
	code varchar(20) NOT NULL,
  "name" varchar(250) NOT NULL,
  movement_type_id int4 NOT NULL,
  FOREIGN KEY (movement_type_id) REFERENCES public.movement_type(id) ON DELETE CASCADE,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- ** DocumentEngine **
CREATE TABLE if not exists  public.document_engine (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	code varchar(100) NOT NULL,
  "name" varchar(250) NOT NULL,
  description text null,
	document_type_id int4 NOT NULL,
  initial_state_id int4 not NULL,
  is_default bool DEFAULT false not NULL, -- only one default per document type
	PRIMARY KEY (id),
  FOREIGN KEY (document_type_id) REFERENCES public.document_type(id) ON DELETE CASCADE,
	FOREIGN KEY (initial_state_id) REFERENCES public.document_status(id) ON DELETE cascade
);

-- document_engine_item: defining allowed state transitions and actions for a document engine
CREATE TABLE if not exists  public.document_engine_item (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	document_engine_id uuid NOT NULL,
	from_state_id int4 NOT NULL,
	to_state_id int4 NOT NULL,
	allow_backwards bool DEFAULT false NOT NULL,
	document_action_id int4 NOT NULL,
	UNIQUE (document_engine_id, from_state_id, to_state_id),
	PRIMARY KEY (id),
	FOREIGN KEY (document_engine_id) REFERENCES public.document_engine(id) ON DELETE CASCADE,
	FOREIGN KEY (from_state_id) REFERENCES public.document_status(id) ON DELETE CASCADE,
	FOREIGN KEY (to_state_id) REFERENCES public.document_status(id) ON DELETE CASCADE,
  FOREIGN KEY (document_action_id) REFERENCES public.document_action(id) ON DELETE CASCADE
);

-- tenant_document_engine: linking tenants to document engines they can use
CREATE TABLE if not exists  public.tenant_document_engine (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  tenant_id uuid NOT NULL,
  document_engine_id uuid NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE,
  FOREIGN KEY (document_engine_id) REFERENCES public.document_engine(id) ON DELETE CASCADE,
  UNIQUE (tenant_id, document_engine_id)
);

-- ** Sales_Order tables **
-- sales_order: header table linked to tenant, business unit, customer, agent, and document status (workflow state)
CREATE TABLE if not exists  public.sales_order (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	tenant_id uuid not NULL,
	business_unit_id uuid not NULL,
	customer_id uuid not NULL,
	agent_id uuid not NULL,
	document_status_id int4 not NULL,
	document_type_id int4 not null,
  total_amount numeric(15, 2) DEFAULT 0 not NULL,
	scheduled_at timestamptz NULL,
	is_posted bool DEFAULT false not NULL,
	is_printed bool DEFAULT false not NULL,
  extra_data jsonb NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	removed_at timestamptz NULL,
	removed_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE,
  FOREIGN KEY (business_unit_id) REFERENCES public.business_unit(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES public.business_partner(id) ON DELETE CASCADE,
	FOREIGN KEY (customer_id) REFERENCES public.business_partner(id) ON DELETE CASCADE,
	FOREIGN KEY (document_status_id) REFERENCES public.document_status(id) ON DELETE CASCADE,
	foreign key (document_type_id) references document_type(id) on delete cascade
);

-- sales_order_item: linked to sales_order and product, with quantity, price and discount information
CREATE TABLE if not exists  public.sales_order_item (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	sales_order_id uuid not NULL,
	product_id uuid not NULL,
	quantity numeric(15, 3) NOT NULL,
	unit_price numeric(15, 2) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE,
	FOREIGN KEY (sales_order_id) REFERENCES public.sales_order(id) ON DELETE CASCADE,
  UNIQUE (sales_order_id, product_id)
);

-- **Service Order tables**
-- service_order: header table linked to tenant, business unit, customer, agent, and document status (workflow state)
CREATE TABLE if not exists  public.service_order (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  tenant_id uuid not NULL,
  business_unit_id uuid not NULL,
  customer_id uuid not NULL,
  agent_id uuid not NULL,
  document_status_id int4 not NULL,
	document_type_id int4 not null,
  total_amount numeric(15, 2) DEFAULT 0 not NULL,
  scheduled_at timestamptz NULL,
  is_posted bool DEFAULT false not NULL,
  is_printed bool DEFAULT false not NULL,
  extra_data jsonb NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
  created_by uuid NULL,
  updated_at timestamptz NULL,
  updated_by uuid NULL,
  removed_at timestamptz NULL,
  removed_by uuid NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE,
  FOREIGN KEY (business_unit_id) REFERENCES public.business_unit(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES public.business_partner(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES public.business_partner(id) ON DELETE CASCADE,
  FOREIGN KEY (document_status_id) REFERENCES public.document_status(id) ON DELETE CASCADE,
	foreign key (document_type_id) references document_type(id) on delete cascade
);

-- service_order_item: linked to service_order and product, with quantity, price and discount information
CREATE TABLE if not exists  public.service_order_item (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  service_order_id uuid not NULL,
  product_id uuid not NULL,
  quantity numeric(15, 3) NOT NULL,
  unit_price numeric(15, 2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE,
  FOREIGN KEY (service_order_id) REFERENCES public.service_order(id) ON DELETE CASCADE,
  UNIQUE (service_order_id, product_id)
);

-- **Purchase Order tables**
-- purchase_order: header table linked to tenant, business unit, customer(provider), agent, and document status (workflow state)
CREATE TABLE if not exists  public.purchase_order (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  tenant_id uuid not NULL,
  business_unit_id uuid not NULL,
  customer_id uuid not null, -- provider
  agent_id uuid not NULL,
  document_status_id int4 not NULL,
	document_type_id int4 not null,
  total_amount numeric(15, 2) DEFAULT 0 not NULL,
  scheduled_at timestamptz NULL,
  is_posted bool DEFAULT false not NULL,
  is_printed bool DEFAULT false not NULL,
  extra_data jsonb NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
  created_by uuid NULL,
  updated_at timestamptz NULL,
  updated_by uuid NULL,
  removed_at timestamptz NULL,
  removed_by uuid NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE,
  FOREIGN KEY (business_unit_id) REFERENCES public.business_unit(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id) REFERENCES public.business_partner(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES public.business_partner(id) ON DELETE CASCADE,
  FOREIGN KEY (document_status_id) REFERENCES public.document_status(id) ON DELETE CASCADE,
	foreign key (document_type_id) references document_type(id) on delete cascade
);

-- service_order_item: linked to service_order and product, with quantity, price and discount information
CREATE TABLE if not exists  public.purchase_order_item (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  purchase_order_id uuid not NULL,
  product_id uuid not NULL,
  quantity numeric(15, 3) NOT NULL,
  unit_price numeric(15, 2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE,
  FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_order(id) ON DELETE CASCADE,
  UNIQUE (purchase_order_id, product_id)
);

-- ** Gobernanza/Permisología **
-- role: defining roles within a tenant, with code, name, description, and readonly flag (e.g. admin, sales_rep, warehouse_manager, etc.)
CREATE TABLE if not exists  public."role" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	tenant_id uuid not NULL,
  code varchar(50) not NULL,
  "name" varchar(100) not NULL,
	description text NULL,
	readonly bool DEFAULT false not NULL,
	item_order int4 DEFAULT 0 not NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	removed_at timestamptz NULL,
	removed_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX uq_role
ON public."role" (tenant_id, code, removed_at) 
NULLS NOT DISTINCT;

-- access_scope: defining access scopes/permissions that can be assigned to roles (e.g. manage_orders, view_reports, etc.)
CREATE TABLE if not exists  public.access_scope (
	id serial4 NOT NULL,
	code varchar(30) NOT NULL,-- own_records, unit_records, tenant_records
  "name" varchar(50) NOT NULL,
  description text NULL,
	item_order int4 DEFAULT 0 not null,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- platform: defining platforms that can be linked to tenants for multi-platform support (e.g. web, mobile, pos, etc.)
CREATE TABLE if not exists  public.platform (
	id serial4 NOT NULL,
	"name" varchar(100) NULL,
	code varchar(50) NULL,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- app_module: defining application modules that can be linked to platforms (e.g. inventory, sales, reporting, etc.)
CREATE TABLE if not exists  public.app_module (
	id serial4 NOT NULL,
	platform_id int4 NULL,
	"name" varchar(100) NULL,
	code varchar(50) NULL,
	item_order int4 DEFAULT 0 not null,
	PRIMARY KEY (id),
	FOREIGN KEY (platform_id) REFERENCES public.platform(id) ON DELETE CASCADE,
  unique (platform_id, code)
);

-- app_sub_module: defining sub-modules linked to app modules (e.g. under inventory module: stock management, purchase orders, etc.)
CREATE TABLE if not exists  public.app_sub_module (
	id serial4 NOT NULL,
	app_module_id int4 NULL,
	"name" varchar(100) NULL,
	code varchar(50) NULL,
	item_order int4 DEFAULT 0 not null,
	PRIMARY KEY (id),
	FOREIGN KEY (app_module_id) REFERENCES public.app_module(id) ON DELETE CASCADE,
  unique (app_module_id, code)
);

-- permission_type: defining types of permissions that can be assigned to roles for specific app modules/sub-modules (e.g. full_access, read_only, etc.)
CREATE TABLE if not exists  public.permission_type (
	id serial4 NOT NULL,
	"name" varchar(50) NOT NULL,
	code varchar(20) NOT NULL, -- read_only, read_write, full_access, admin_access.
  description text NULL,
	item_order int4 DEFAULT 0 not null,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- permission: linking roles to specific permissions for app sub-modules, with access scope and permission type
CREATE TABLE if not exists  public."permission" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	role_id uuid not NULL,
	app_sub_module_id int4 not NULL,
	access_scope_id int4 not NULL,
	permission_type_id int4 not NULL,
	readonly bool DEFAULT false not NULL,
	item_order int4 DEFAULT 0 not NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	removed_at timestamptz NULL,
	removed_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (permission_type_id) REFERENCES public.permission_type(id) ON DELETE CASCADE,
	FOREIGN KEY (role_id) REFERENCES public."role"(id) ON DELETE CASCADE,
	FOREIGN KEY (access_scope_id) REFERENCES public.access_scope(id) ON DELETE CASCADE,
	FOREIGN KEY (app_sub_module_id) REFERENCES public.app_sub_module(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX uq_permission
ON public."permission" (role_id, app_sub_module_id, access_scope_id, removed_at) 
NULLS NOT DISTINCT;

-- tenant_module: linking tenants to app modules they have access to, with active flag and optional expiration date for module access (e.g. for trial periods or subscription-based access)
CREATE TABLE if not exists  public.tenant_module (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	tenant_id uuid not NULL,
	app_module_id int4 not NULL,
	active bool DEFAULT true not NULL,
	expires_at timestamptz NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
	updated_at timestamptz null,
	PRIMARY KEY (id),
	FOREIGN KEY (app_module_id) REFERENCES public.app_module(id) ON DELETE CASCADE,
	FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE,
  unique (tenant_id, app_module_id)
);

-- ** Applications User **
-- app_user_status: defining possible statuses for application users 
CREATE TABLE if not exists  public.app_user_status (
	id serial4 NOT NULL,
  code varchar(20) NOT NULL, -- active, inactive, suspended, blocked, expired
	"name" varchar(50) NOT NULL,
	item_order int4 DEFAULT 0 not null,
  description text NULL,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- app_user: defining application users linked to business partners, with username, password hash, status, role, and profile data
CREATE TABLE if not exists  public.app_user (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	business_partner_id uuid not NULL,
	role_id uuid not NULL,
  status_id int4 not NULL,
  username varchar(100) NOT NULL,
	password_hash text NOT NULL,
	profile_data jsonb NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	created_by uuid NULL,
	updated_at timestamptz NULL,
	updated_by uuid NULL,
	removed_at timestamptz NULL,
	removed_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (business_partner_id) REFERENCES public.business_partner(id) ON DELETE CASCADE,
	FOREIGN KEY (role_id) REFERENCES public."role"(id) ON DELETE CASCADE,
	FOREIGN KEY (status_id) REFERENCES public.app_user_status(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX uq_app_user_partner
ON public.app_user (business_partner_id, removed_at) 
NULLS NOT DISTINCT;
CREATE UNIQUE INDEX uq_app_user_username
ON public.app_user (username, removed_at) 
NULLS NOT DISTINCT;

-- app_user_business_unit: linking application users to business units they have access to
CREATE TABLE if not exists  public.app_user_business_unit (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	app_user_id uuid not NULL,
	business_unit_id uuid not NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
	created_by uuid NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (app_user_id) REFERENCES public.app_user(id) ON DELETE CASCADE,
	FOREIGN KEY (business_unit_id) REFERENCES public.business_unit(id) ON DELETE CASCADE,
  unique (app_user_id, business_unit_id)
);

-- ** Translation tables **
-- base_translation: defining base translation keys and default values for the application
CREATE TABLE if not exists  public.base_translation (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	code varchar(100) NOT NULL, -- {platform.module.submodule.key} e.g. {web.inventory.stock_management.add_product}
	default_value text NOT NULL,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- industry_translation: linking industry-specific translations to base translation keys with preset values
CREATE TABLE if not exists  public.industry_translation (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	industry_id int4 not NULL,
	base_translation_id uuid not NULL,
	custom_value text NOT NULL,
	UNIQUE (industry_id, base_translation_id),
	PRIMARY KEY (id),
	FOREIGN KEY (industry_id) REFERENCES public.industry(id) ON DELETE CASCADE,
	FOREIGN KEY (base_translation_id) REFERENCES public.base_translation(id) ON DELETE CASCADE
);

-- tenant_translation: allowing tenants to customize translation values for specific keys
CREATE TABLE if not exists  public.tenant_translation (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	tenant_id uuid not NULL,
	base_translation_id uuid not NULL,
	custom_value text NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON DELETE CASCADE,
  FOREIGN KEY (base_translation_id) REFERENCES public.base_translation(id) ON DELETE CASCADE,
	unique (tenant_id, base_translation_id)
);

-- ** Session and Audit Logs **
-- event_type: defining types of events for audit logging (e.g. login_success, login_failed, logout, password_change, etc.)
CREATE TABLE if not exists  public.event_type (
	id serial4 NOT NULL,
	code varchar(30) NOT NULL, -- login_success, login_failed, logout, password_change
  "name" varchar(50) NOT NULL,
	UNIQUE (code),
	PRIMARY KEY (id)
);

-- auth_audit_log: storing authentication-related events for application users, linked to event types, with optional identifier (e.g. IP address) and extra data for additional context (e.g. user agent, error messages, etc.) for security auditing and monitoring purposes
CREATE TABLE if not exists  public.auth_audit_log (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	app_user_id uuid not NULL,
	identifier varchar(255) not NULL, -- username or email used for login attempt, or IP address for suspicious activity
	event_type_id int4 not NULL,
	extra_data jsonb NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (app_user_id) REFERENCES public.app_user(id) ON DELETE CASCADE,
	FOREIGN KEY (event_type_id) REFERENCES public.event_type(id) ON DELETE CASCADE
);

-- user_session: tracking user sessions with app user reference, IP address, user agent, last active timestamp, and active flag for session management
CREATE TABLE if not exists  public.user_session (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	app_user_id uuid not NULL,
	ip_address varchar(45) NULL,
	user_agent text NULL,
	last_active_at timestamptz DEFAULT CURRENT_TIMESTAMP not NULL,
	active bool DEFAULT true NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (app_user_id) REFERENCES public.app_user(id) ON DELETE CASCADE
);

-- refresh_token: storing refresh tokens for application users with expiration and revocation information for secure session management and token-based authentication
CREATE TABLE if not exists  public.refresh_token (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	app_user_id uuid not NULL,
	"token" text NOT NULL,
	expires_at timestamptz NOT NULL,
	revoked_at timestamptz NULL,
	PRIMARY KEY (id),
	UNIQUE (token),
	FOREIGN KEY (app_user_id) REFERENCES public.app_user(id) ON DELETE CASCADE
);

