/**
 *  The sentry v7 event structure.
 */
export type Event = {
  /**
   *  List of breadcrumbs recorded before this event.
   */
  breadcrumbs?: {
    values: (Breadcrumb | null)[]
    [k: string]: unknown
  } | null
  /**
   *  Contexts describing the environment (e.g. device, os or browser).
   */
  contexts?: Contexts | null
  /**
   *  Custom culprit of the event.
   */
  culprit?: string | null
  /**
   *  Meta data for event processing and debugging.
   */
  debug_meta?: DebugMeta | null
  /**
   *  Program's distribution identifier.
   *
   *  The distribution of the application.
   *
   *  Distributions are used to disambiguate build or deployment variants of the same release of
   *  an application. For example, the dist can be the build number of an XCode build or the
   *  version code of an Android build.
   */
  dist?: string | null
  /**
   *  The environment name, such as `production` or `staging`.
   *
   *  ```json
   *  { "environment": "production" }
   *  ```
   */
  environment?: string | null
  /**
   *  Errors encountered during processing. Intended to be phased out in favor of
   *  annotation/metadata system.
   */
  errors?: (EventProcessingError | null)[] | null
  /**
   *  Unique identifier of this event.
   *
   *  Hexadecimal string representing a uuid4 value. The length is exactly 32 characters. Dashes
   *  are not allowed. Has to be lowercase.
   *
   *  Even though this field is backfilled on the server with a new uuid4, it is strongly
   *  recommended to generate that uuid4 clientside. There are some features like user feedback
   *  which are easier to implement that way, and debugging in case events get lost in your
   *  Sentry installation is also easier.
   *
   *  Example:
   *
   *  ```json
   *  {
   *    "event_id": "fc6d8c0c43fc4630ad850ee518f1b9d0"
   *  }
   *  ```
   */
  event_id?: EventId | null
  /**
   *  One or multiple chained (nested) exceptions.
   */
  exception?: {
    values: (Exception | null)[]
    [k: string]: unknown
  } | null
  /**
   *  Arbitrary extra information set by the user.
   *
   *  ```json
   *  {
   *      "extra": {
   *          "my_key": 1,
   *          "some_other_value": "foo bar"
   *      }
   *  }```
   */
  extra?: {
    [k: string]: unknown
  } | null
  /**
   *  Manual fingerprint override.
   *
   *  A list of strings used to dictate how this event is supposed to be grouped with other
   *  events into issues. For more information about overriding grouping see [Customize Grouping
   *  with Fingerprints](https://docs.sentry.io/data-management/event-grouping/).
   *
   *  ```json
   *  {
   *      "fingerprint": ["myrpc", "POST", "/foo.bar"]
   *  }
   */
  fingerprint?: Fingerprint | null
  /**
   *  Severity level of the event. Defaults to `error`.
   *
   *  Example:
   *
   *  ```json
   *  {"level": "warning"}
   *  ```
   */
  level?: Level | null
  /**
   *  Custom parameterized message for this event.
   */
  logentry?: LogEntry | null
  /**
   *  Logger that created the event.
   */
  logger?: string | null
  /**
   *  Name and versions of all installed modules/packages/dependencies in the current
   *  environment/application.
   *
   *  ```json
   *  { "django": "3.0.0", "celery": "4.2.1" }
   *  ```
   *
   *  In Python this is a list of installed packages as reported by `pkg_resources` together with
   *  their reported version string.
   *
   *  This is primarily used for suggesting to enable certain SDK integrations from within the UI
   *  and for making informed decisions on which frameworks to support in future development
   *  efforts.
   */
  modules?: {
    [k: string]: string | null
  } | null
  /**
   *  Platform identifier of this event (defaults to "other").
   *
   *  A string representing the platform the SDK is submitting from. This will be used by the
   *  Sentry interface to customize various components in the interface, but also to enter or
   *  skip stacktrace processing.
   *
   *  Acceptable values are: `as3`, `c`, `cfml`, `cocoa`, `csharp`, `elixir`, `haskell`, `go`,
   *  `groovy`, `java`, `javascript`, `native`, `node`, `objc`, `other`, `perl`, `php`, `python`,
   *  `ruby`
   */
  platform?: string | null
  /**
   *  Timestamp when the event has been received by Sentry.
   */
  received?: Timestamp | null
  /**
   *  The release version of the application.
   *
   *  **Release versions must be unique across all projects in your organization.** This value
   *  can be the git SHA for the given project, or a product identifier with a semantic version.
   */
  release?: string | null
  /**
   *  Information about a web request that occurred during the event.
   */
  request?: Request | null
  /**
   *  Information about the Sentry SDK that generated this event.
   */
  sdk?: ClientSdkInfo | null
  /**
   *  Server or device name the event was generated on.
   *
   *  This is supposed to be a hostname.
   */
  server_name?: string | null
  /**
   *  Event stacktrace.
   *
   *  DEPRECATED: Prefer `threads` or `exception` depending on which is more appropriate.
   */
  stacktrace?: Stacktrace | null
  /**
   *  Custom tags for this event.
   *
   *  A map or list of tags for this event. Each tag must be less than 200 characters.
   */
  tags?: Tags | null
  /**
   *  Threads that were active when the event occurred.
   */
  threads?: {
    values: (Thread | null)[]
    [k: string]: unknown
  } | null
  /**
   *  Time since the start of the transaction until the error occurred.
   */
  time_spent?: number | null
  /**
   *  Timestamp when the event was created.
   *
   *  Indicates when the event was created in the Sentry SDK. The format is either a string as
   *  defined in [RFC 3339](https://tools.ietf.org/html/rfc3339) or a numeric (integer or float)
   *  value representing the number of seconds that have elapsed since the [Unix
   *  epoch](https://en.wikipedia.org/wiki/Unix_time).
   *
   *  Sub-microsecond precision is not preserved with numeric values due to precision
   *  limitations with floats (at least in our systems). With that caveat in mind, just send
   *  whatever is easiest to produce.
   *
   *  All timestamps in the event protocol are formatted this way.
   *
   *  ```json
   *  { "timestamp": "2011-05-02T17:41:36Z" }
   *  { "timestamp": 1304358096.0 }
   *  ```
   */
  timestamp?: Timestamp | null
  /**
   *  Transaction name of the event.
   *
   *  For example, in a web app, this might be the route name (`"/users/<username>/"` or
   *  `UserView`), in a task queue it might be the function + module name.
   */
  transaction?: string | null
  /**
   *  Type of event: error, csp, default
   */
  type?: EventType | null
  /**
   *  Information about the user who triggered this event.
   */
  user?: User | null
  /**
   *  Version
   */
  version?: string | null
  [k: string]: unknown
}
/**
 *  The Breadcrumbs Interface specifies a series of application events, or "breadcrumbs", that
 *  occurred before an event.
 *
 *  An event may contain one or more breadcrumbs in an attribute named `breadcrumbs`. The entries
 *  are ordered from oldest to newest. Consequently, the last entry in the list should be the last
 *  entry before the event occurred.
 *
 *  While breadcrumb attributes are not strictly validated in Sentry, a breadcrumb is most useful
 *  when it includes at least a `timestamp` and `type`, `category` or `message`. The rendering of
 *  breadcrumbs in Sentry depends on what is provided.
 *
 *  The following example illustrates the breadcrumbs part of the event payload and omits other
 *  attributes for simplicity.
 *
 *  ```json
 *  {
 *    "breadcrumbs": {
 *      "values": [
 *        {
 *          "timestamp": "2016-04-20T20:55:53.845Z",
 *          "message": "Something happened",
 *          "category": "log",
 *          "data": {
 *            "foo": "bar",
 *            "blub": "blah"
 *          }
 *        },
 *        {
 *          "timestamp": "2016-04-20T20:55:53.847Z",
 *          "type": "navigation",
 *          "data": {
 *            "from": "/login",
 *            "to": "/dashboard"
 *          }
 *        }
 *      ]
 *    }
 *  }
 *  ```
 */
export type Breadcrumb = {
  /**
   *  A dotted string indicating what the crumb is or from where it comes. _Optional._
   *
   *  Typically it is a module name or a descriptive string. For instance, _ui.click_ could be
   *  used to indicate that a click happened in the UI or _flask_ could be used to indicate that
   *  the event originated in the Flask framework.
   */
  category?: string | null
  /**
   *  Arbitrary data associated with this breadcrumb.
   *
   *  Contains a dictionary whose contents depend on the breadcrumb `type`. Additional parameters
   *  that are unsupported by the type are rendered as a key/value table.
   */
  data?: {
    [k: string]: unknown
  } | null
  /**
   *  Severity level of the breadcrumb. _Optional._
   *
   *  Allowed values are, from highest to lowest: `fatal`, `error`, `warning`, `info`, and
   *  `debug`. Levels are used in the UI to emphasize and deemphasize the crumb. Defaults to
   *  `info`.
   */
  level?: Level | null
  /**
   *  Human readable message for the breadcrumb.
   *
   *  If a message is provided, it is rendered as text with all whitespace preserved. Very long
   *  text might be truncated in the UI.
   */
  message?: string | null
  /**
   *  The timestamp of the breadcrumb. Recommended.
   *
   *  A timestamp representing when the breadcrumb occurred. The format is either a string as
   *  defined in [RFC 3339](https://tools.ietf.org/html/rfc3339) or a numeric (integer or float)
   *  value representing the number of seconds that have elapsed since the [Unix
   *  epoch](https://en.wikipedia.org/wiki/Unix_time).
   *
   *  Breadcrumbs are most useful when they include a timestamp, as it creates a timeline leading
   *  up to an event.
   */
  timestamp?: Timestamp | null
  /**
   *  The type of the breadcrumb. _Optional_, defaults to `default`.
   *
   *  - `default`: Describes a generic breadcrumb. This is typically a log message or
   *    user-generated breadcrumb. The `data` field is entirely undefined and as such, completely
   *    rendered as a key/value table.
   *
   *  - `navigation`: Describes a navigation breadcrumb. A navigation event can be a URL change
   *    in a web application, or a UI transition in a mobile or desktop application, etc.
   *
   *    Such a breadcrumb's `data` object has the required fields `from` and `to`, which
   *    represent an application route/url each.
   *
   *  - `http`: Describes an HTTP request breadcrumb. This represents an HTTP request transmitted
   *    from your application. This could be an AJAX request from a web application, or a
   *    server-to-server HTTP request to an API service provider, etc.
   *
   *    Such a breadcrumb's `data` property has the fields `url`, `method`, `status_code`
   *    (integer) and `reason` (string).
   */
  type?: string | null
  [k: string]: unknown
}
/**
 * Severity level of an event or breadcrumb.
 */
export type Level = "debug" | "info" | "warning" | "error" | "fatal"
/**
 * Can be a ISO-8601 formatted string or a unix timestamp in seconds (floating point values allowed).
 *
 * Must be UTC.
 */
export type Timestamp = number | string
/**
 *  The Contexts Interface provides additional context data. Typically, this is data related to the
 *  current user and the environment. For example, the device or application version. Its canonical
 *  name is `contexts`.
 *
 *  The `contexts` type can be used to define arbitrary contextual data on the event. It accepts an
 *  object of key/value pairs. The key is the “alias” of the context and can be freely chosen.
 *  However, as per policy, it should match the type of the context unless there are two values for
 *  a type. You can omit `type` if the key name is the type.
 *
 *  Unknown data for the contexts is rendered as a key/value list.
 *
 *  For more details about sending additional data with your event, see the [full documentation on
 *  Additional Data](https://docs.sentry.io/enriching-error-data/additional-data/).
 */
export type Contexts = {
  [k: string]: ContextInner | null
}
export type ContextInner = Context
/**
 *  A context describes environment info (e.g. device, os or browser).
 */
export type Context =
  | DeviceContext
  | OsContext
  | RuntimeContext
  | AppContext
  | BrowserContext
  | GpuContext
  | TraceContext
  | MonitorContext
  | {
      [k: string]: unknown
    }
/**
 *  Device information.
 *
 *  Device context describes the device that caused the event. This is most appropriate for mobile
 *  applications.
 */
export type DeviceContext = {
  /**
   *  Native cpu architecture of the device.
   */
  arch?: string | null
  /**
   *  Current battery level in %.
   *
   *  If the device has a battery, this can be a floating point value defining the battery level
   *  (in the range 0-100).
   */
  battery_level?: number | null
  /**
   *  Indicator when the device was booted.
   */
  boot_time?: string | null
  /**
   *  Brand of the device.
   */
  brand?: string | null
  /**
   *  Whether the device was charging or not.
   */
  charging?: boolean | null
  /**
   *  Free size of the attached external storage in bytes (eg: android SDK card).
   */
  external_free_storage?: number | null
  /**
   *  Total size of the attached external storage in bytes (eg: android SDK card).
   */
  external_storage_size?: number | null
  /**
   *  Family of the device model.
   *
   *  This is usually the common part of model names across generations. For instance, `iPhone`
   *  would be a reasonable family, so would be `Samsung Galaxy`.
   */
  family?: string | null
  /**
   *  How much memory is still available in bytes.
   */
  free_memory?: number | null
  /**
   *  How much storage is free in bytes.
   */
  free_storage?: number | null
  /**
   *  Whether the device was low on memory.
   */
  low_memory?: boolean | null
  /**
   *  Manufacturer of the device.
   */
  manufacturer?: string | null
  /**
   *  Total memory available in bytes.
   */
  memory_size?: number | null
  /**
   *  Device model.
   *
   *  This, for example, can be `Samsung Galaxy S3`.
   */
  model?: string | null
  /**
   *  Device model (internal identifier).
   *
   *  An internal hardware revision to identify the device exactly.
   */
  model_id?: string | null
  /**
   *  Name of the device.
   */
  name?: string | null
  /**
   *  Whether the device was online or not.
   */
  online?: boolean | null
  /**
   *  Current screen orientation.
   *
   *  This can be a string `portrait` or `landscape` to define the orientation of a device.
   */
  orientation?: string | null
  /**
   *  Device screen density.
   */
  screen_density?: number | null
  /**
   *  Screen density as dots-per-inch.
   */
  screen_dpi?: number | null
  /**
   *  Device screen resolution.
   *
   *  (e.g.: 800x600, 3040x1444)
   */
  screen_resolution?: string | null
  /**
   *  Simulator/prod indicator.
   */
  simulator?: boolean | null
  /**
   *  Total storage size of the device in bytes.
   */
  storage_size?: number | null
  /**
   *  Timezone of the device.
   */
  timezone?: string | null
  /**
   *  How much memory is usable for the app in bytes.
   */
  usable_memory?: number | null
  [k: string]: unknown
}
/**
 *  Operating system information.
 *
 *  OS context describes the operating system on which the event was created. In web contexts, this
 *  is the operating system of the browser (generally pulled from the User-Agent string).
 */
export type OsContext = {
  /**
   *  Internal build number of the operating system.
   */
  build?: string | null
  /**
   *  Current kernel version.
   *
   *  This is typically the entire output of the `uname` syscall.
   */
  kernel_version?: string | null
  /**
   *  Name of the operating system.
   */
  name?: string | null
  /**
   *  Unprocessed operating system info.
   *
   *  An unprocessed description string obtained by the operating system. For some well-known
   *  runtimes, Sentry will attempt to parse `name` and `version` from this string, if they are
   *  not explicitly given.
   */
  raw_description?: string | null
  /**
   *  Indicator if the OS is rooted (mobile mostly).
   */
  rooted?: boolean | null
  /**
   *  Version of the operating system.
   */
  version?: string | null
  [k: string]: unknown
}
/**
 *  Runtime information.
 *
 *  Runtime context describes a runtime in more detail. Typically, this context is present in
 *  `contexts` multiple times if multiple runtimes are involved (for instance, if you have a
 *  JavaScript application running on top of JVM).
 */
export type RuntimeContext = {
  /**
   *  Application build string, if it is separate from the version.
   */
  build?: string | null
  /**
   *  Runtime name.
   */
  name?: string | null
  /**
   *  Unprocessed runtime info.
   *
   *  An unprocessed description string obtained by the runtime. For some well-known runtimes,
   *  Sentry will attempt to parse `name` and `version` from this string, if they are not
   *  explicitly given.
   */
  raw_description?: string | null
  /**
   *  Runtime version string.
   */
  version?: string | null
  [k: string]: unknown
}
/**
 *  Application information.
 *
 *  App context describes the application. As opposed to the runtime, this is the actual
 *  application that was running and carries metadata about the current session.
 */
export type AppContext = {
  /**
   *  Internal build ID as it appears on the platform.
   */
  app_build?: string | null
  /**
   *  Version-independent application identifier, often a dotted bundle ID.
   */
  app_identifier?: string | null
  /**
   *  Application name as it appears on the platform.
   */
  app_name?: string | null
  /**
   *  Start time of the app.
   *
   *  Formatted UTC timestamp when the user started the application.
   */
  app_start_time?: string | null
  /**
   *  Application version as it appears on the platform.
   */
  app_version?: string | null
  /**
   *  String identifying the kind of build. For example, `testflight`.
   */
  build_type?: string | null
  /**
   *  Application-specific device identifier.
   */
  device_app_hash?: string | null
  [k: string]: unknown
}
/**
 *  Web browser information.
 */
export type BrowserContext = {
  /**
   *  Display name of the browser application.
   */
  name?: string | null
  /**
   *  Version string of the browser.
   */
  version?: string | null
  [k: string]: unknown
}
/**
 *  GPU information.
 *
 *  Example:
 *
 *  ```json
 *  "gpu": {
 *    "name": "AMD Radeon Pro 560",
 *    "vendor_name": "Apple",
 *    "memory_size": 4096,
 *    "api_type": "Metal",
 *    "multi_threaded_rendering": true,
 *    "version": "Metal",
 *    "npot_support": "Full"
 *  }
 *  ```
 */
export type GpuContext = {
  /**
   *  The device low-level API type.
   *
   *  Examples: `"Apple Metal"` or `"Direct3D11"`
   */
  api_type?: string | null
  /**
   *  The PCI identifier of the graphics device.
   */
  id?: {
    [k: string]: unknown
  }
  /**
   *  The total GPU memory available in Megabytes.
   */
  memory_size?: number | null
  /**
   *  Whether the GPU has multi-threaded rendering or not.
   */
  multi_threaded_rendering?: boolean | null
  /**
   *  The name of the graphics device.
   */
  name?: string | null
  /**
   *  The Non-Power-Of-Two support.
   */
  npot_support?: string | null
  /**
   *  The PCI vendor identifier of the graphics device.
   */
  vendor_id?: string | null
  /**
   *  The vendor name as reported by the graphics device.
   */
  vendor_name?: string | null
  /**
   *  The Version of the graphics device.
   */
  version?: string | null
  [k: string]: unknown
}
/**
 *  Trace context
 */
export type TraceContext = {
  /**
   *  Span type (see `OperationType` docs).
   */
  op?: string | null
  /**
   *  The ID of the span enclosing this span.
   */
  parent_span_id?: SpanId | null
  /**
   *  The ID of the span.
   */
  span_id: SpanId | null
  /**
   *  Whether the trace failed or succeeded. Currently only used to indicate status of individual
   *  transactions.
   */
  status?: SpanStatus | null
  /**
   *  The trace ID.
   */
  trace_id: TraceId | null
  [k: string]: unknown
}
/**
 *  A 16-character hex string as described in the W3C trace context spec.
 */
export type SpanId = string
/**
 * Trace status.
 *
 * Values from <https://github.com/open-telemetry/opentelemetry-specification/blob/8fb6c14e4709e75a9aaa64b0dbbdf02a6067682a/specification/api-tracing.md#status> Mapping to HTTP from <https://github.com/open-telemetry/opentelemetry-specification/blob/8fb6c14e4709e75a9aaa64b0dbbdf02a6067682a/specification/data-http.md#status>
 */
export type SpanStatus =
  | "ok"
  | "cancelled"
  | "unknown"
  | "invalid_argument"
  | "deadline_exceeded"
  | "not_found"
  | "already_exists"
  | "permission_denied"
  | "resource_exhausted"
  | "failed_precondition"
  | "aborted"
  | "out_of_range"
  | "unimplemented"
  | "internal_error"
  | "unavailable"
  | "data_loss"
  | "unauthenticated"
/**
 *  A 32-character hex string as described in the W3C trace context spec.
 */
export type TraceId = string
/**
 *  Monitor information.
 */
export type MonitorContext = {
  [k: string]: unknown
}
/**
 *  Debugging and processing meta information.
 *
 *  The debug meta interface carries debug information for processing errors and crash reports.
 *  Sentry amends the information in this interface.
 *
 *  Example (look at field types to see more detail):
 *
 *  ```json
 *  {
 *    "debug_meta": {
 *      "images": [],
 *      "sdk_info": {
 *        "sdk_name": "iOS",
 *        "version_major": 10,
 *        "version_minor": 3,
 *        "version_patchlevel": 0
 *      }
 *    }
 *  }
 *  ```
 */
export type DebugMeta = {
  /**
   *  List of debug information files (debug images).
   */
  images?: (DebugImage | null)[] | null
  /**
   *  Information about the system SDK (e.g. iOS SDK).
   */
  sdk_info?: SystemSdkInfo | null
  [k: string]: unknown
}
/**
 *  A debug information file (debug image).
 */
export type DebugImage =
  | AppleDebugImage
  | NativeDebugImage
  | NativeDebugImage
  | NativeDebugImage
  | NativeDebugImage
  | ProguardDebugImage
  | NativeDebugImage
  | {
      [k: string]: unknown
    }
/**
 *  Legacy apple debug images (MachO).
 *
 *  This was also used for non-apple platforms with similar debug setups.
 */
export type AppleDebugImage = {
  /**
   *  CPU architecture target.
   */
  arch?: string | null
  /**
   *  MachO CPU subtype identifier.
   */
  cpu_subtype?: number | null
  /**
   *  MachO CPU type identifier.
   */
  cpu_type?: number | null
  /**
   *  Starting memory address of the image (required).
   */
  image_addr: Addr | null
  /**
   *  Size of the image in bytes (required).
   */
  image_size: number | null
  /**
   *  Loading address in virtual memory.
   */
  image_vmaddr?: Addr | null
  /**
   *  Path and name of the debug image (required).
   */
  name: string | null
  /**
   *  The unique UUID of the image.
   */
  uuid: string | null
  [k: string]: unknown
}
export type Addr = string
/**
 *  A generic (new-style) native platform debug information file.
 *
 *  The `type` key must be one of:
 *
 *  - `macho`
 *  - `elf`: ELF images are used on Linux platforms. Their structure is identical to other native images.
 *  - `pe`
 *
 *  Examples:
 *
 *  ```json
 *  {
 *    "type": "elf",
 *    "code_id": "68220ae2c65d65c1b6aaa12fa6765a6ec2f5f434",
 *    "code_file": "/lib/x86_64-linux-gnu/libgcc_s.so.1",
 *    "debug_id": "e20a2268-5dc6-c165-b6aa-a12fa6765a6e",
 *    "image_addr": "0x7f5140527000",
 *    "image_size": 90112,
 *    "image_vmaddr": "0x40000",
 *    "arch": "x86_64"
 *  }
 *  ```
 *
 *  ```json
 *  {
 *    "type": "pe",
 *    "code_id": "57898e12145000",
 *    "code_file": "C:\\Windows\\System32\\dbghelp.dll",
 *    "debug_id": "9c2a902b-6fdf-40ad-8308-588a41d572a0-1",
 *    "debug_file": "dbghelp.pdb",
 *    "image_addr": "0x70850000",
 *    "image_size": "1331200",
 *    "image_vmaddr": "0x40000",
 *    "arch": "x86"
 *  }
 *  ```
 *
 *  ```json
 *  {
 *    "type": "macho",
 *    "debug_id": "84a04d24-0e60-3810-a8c0-90a65e2df61a",
 *    "debug_file": "libDiagnosticMessagesClient.dylib",
 *    "code_file": "/usr/lib/libDiagnosticMessagesClient.dylib",
 *    "image_addr": "0x7fffe668e000",
 *    "image_size": 8192,
 *    "image_vmaddr": "0x40000",
 *    "arch": "x86_64",
 *  }
 *  ```
 */
export type NativeDebugImage = {
  /**
   *  CPU architecture target.
   *
   *  Architecture of the module. If missing, this will be backfilled by Sentry.
   */
  arch?: string | null
  /**
   *  Path and name of the image file (required).
   *
   *  The absolute path to the dynamic library or executable. This helps to locate the file if it is missing on Sentry.
   *
   *  - `pe`: The code file should be provided to allow server-side stack walking of binary crash reports, such as Minidumps.
   */
  code_file: NativeImagePath | null
  /**
   *  Optional identifier of the code file.
   *
   *  - `elf`: If the program was compiled with a relatively recent compiler, this should be the hex representation of the `NT_GNU_BUILD_ID` program header (type `PT_NOTE`), or the value of the `.note.gnu.build-id` note section (type `SHT_NOTE`). Otherwise, leave this value empty.
   *
   *    Certain symbol servers use the code identifier to locate debug information for ELF images, in which case this field should be included if possible.
   *
   *  - `pe`: Identifier of the executable or DLL. It contains the values of the `time_date_stamp` from the COFF header and `size_of_image` from the optional header formatted together into a hex string using `%08x%X` (note that the second value is not padded):
   *
   *    ```text
   *    time_date_stamp: 0x5ab38077
   *    size_of_image:           0x9000
   *    code_id:           5ab380779000
   *    ```
   *
   *    The code identifier should be provided to allow server-side stack walking of binary crash reports, such as Minidumps.
   *
   *
   *  - `macho`: Identifier of the dynamic library or executable. It is the value of the `LC_UUID` load command in the Mach header, formatted as UUID. Can be empty for Mach images, as it is equivalent to the debug identifier.
   */
  code_id?: CodeId | null
  /**
   *  Path and name of the debug companion file.
   *
   *  - `elf`: Name or absolute path to the file containing stripped debug information for this image. This value might be _required_ to retrieve debug files from certain symbol servers.
   *
   *  - `pe`: Name of the PDB file containing debug information for this image. This value is often required to retrieve debug files from specific symbol servers.
   *
   *  - `macho`: Name or absolute path to the dSYM file containing debug information for this image. This value might be required to retrieve debug files from certain symbol servers.
   */
  debug_file?: NativeImagePath | null
  /**
   *  Unique debug identifier of the image.
   *
   *  - `elf`: Debug identifier of the dynamic library or executable. If a code identifier is available, the debug identifier is the little-endian UUID representation of the first 16-bytes of that
   *  identifier. Spaces are inserted for readability, note the byte order of the first fields:
   *
   *    ```text
   *    code id:  f1c3bcc0 2798 65fe 3058 404b2831d9e6 4135386c
   *    debug id: c0bcc3f1-9827-fe65-3058-404b2831d9e6
   *    ```
   *
   *    If no code id is available, the debug id should be computed by XORing the first 4096 bytes of the `.text` section in 16-byte chunks, and representing it as a little-endian UUID (again swapping the byte order).
   *
   *  - `pe`: `signature` and `age` of the PDB file. Both values can be read from the CodeView PDB70 debug information header in the PE. The value should be represented as little-endian UUID, with the age appended at the end. Note that the byte order of the UUID fields must be swapped (spaces inserted for readability):
   *
   *    ```text
   *    signature: f1c3bcc0 2798 65fe 3058 404b2831d9e6
   *    age:                                            1
   *    debug_id:  c0bcc3f1-9827-fe65-3058-404b2831d9e6-1
   *    ```
   *
   *  - `macho`: Identifier of the dynamic library or executable. It is the value of the `LC_UUID` load command in the Mach header, formatted as UUID.
   */
  debug_id: DebugId | null
  /**
   *  Starting memory address of the image (required).
   *
   *  Memory address, at which the image is mounted in the virtual address space of the process. Should be a string in hex representation prefixed with `"0x"`.
   */
  image_addr?: Addr | null
  /**
   *  Size of the image in bytes (required).
   *
   *  The size of the image in virtual memory. If missing, Sentry will assume that the image spans up to the next image, which might lead to invalid stack traces.
   */
  image_size?: number | null
  /**
   *  Loading address in virtual memory.
   *
   *  Preferred load address of the image in virtual memory, as declared in the headers of the
   *  image. When loading an image, the operating system may still choose to place it at a
   *  different address.
   *
   *  Symbols and addresses in the native image are always relative to the start of the image and do not consider the preferred load address. It is merely a hint to the loader.
   *
   *  - `elf`/`macho`: If this value is non-zero, all symbols and addresses declared in the native image start at this address, rather than 0. By contrast, Sentry deals with addresses relative to the start of the image. For example, with `image_vmaddr: 0x40000`, a symbol located at `0x401000` has a relative address of `0x1000`.
   *
   *    Relative addresses used in Apple Crash Reports and `addr2line` are usually in the preferred address space, and not relative address space.
   */
  image_vmaddr?: Addr | null
  [k: string]: unknown
}
/**
 *  A type for strings that are generally paths, might contain system user names, but still cannot
 *  be stripped liberally because it would break processing for certain platforms.
 *
 *  Those strings get special treatment in our PII processor to avoid stripping the basename.
 */
export type NativeImagePath = string
export type CodeId = string
export type DebugId = string
/**
 *  Proguard mapping file.
 *
 *  Proguard images refer to `mapping.txt` files generated when Proguard obfuscates function names. The Java SDK integrations assign this file a unique identifier, which has to be included in the list of images.
 */
export type ProguardDebugImage = {
  /**
   *  UUID computed from the file contents, assigned by the Java SDK.
   */
  uuid: string | null
  [k: string]: unknown
}
/**
 *  Holds information about the system SDK.
 *
 *  This is relevant for iOS and other platforms that have a system
 *  SDK.  Not to be confused with the client SDK.
 */
export type SystemSdkInfo = {
  /**
   *  The internal name of the SDK.
   */
  sdk_name?: string | null
  /**
   *  The major version of the SDK as integer or 0.
   */
  version_major?: number | null
  /**
   *  The minor version of the SDK as integer or 0.
   */
  version_minor?: number | null
  /**
   *  The patch version of the SDK as integer or 0.
   */
  version_patchlevel?: number | null
  [k: string]: unknown
}
/**
 *  An event processing error.
 */
export type EventProcessingError = {
  /**
   *  Affected key or deep path.
   */
  name?: string | null
  /**
   *  The error kind.
   */
  type: string | null
  /**
   *  The original value causing this error.
   */
  value?: {
    [k: string]: unknown
  }
  [k: string]: unknown
}
/**
 *  Wrapper around a UUID with slightly different formatting.
 */
export type EventId = string
/**
 *  A single exception.
 *
 *  Multiple values inside of an [event](#typedef-Event) represent chained exceptions and should be sorted oldest to newest. For example, consider this Python code snippet:
 *
 *  ```python
 *  try:
 *      raise Exception("random boring invariant was not met!")
 *  except Exception as e:
 *      raise ValueError("something went wrong, help!") from e
 *  ```
 *
 *  `Exception` would be described first in the values list, followed by a description of `ValueError`:
 *
 *  ```json
 *  {
 *    "exception": {
 *      "values": [
 *        {"type": "Exception": "value": "random boring invariant was not met!"},
 *        {"type": "ValueError", "value": "something went wrong, help!"},
 *      ]
 *    }
 *  }
 *  ```
 */
export type Exception = {
  /**
   *  Mechanism by which this exception was generated and handled.
   */
  mechanism?: Mechanism | null
  /**
   *  The optional module, or package which the exception type lives in.
   */
  module?: string | null
  /**
   *  Stack trace containing frames of this exception.
   */
  stacktrace?: Stacktrace | null
  /**
   *  An optional value that refers to a [thread](#typedef-Thread).
   */
  thread_id?: ThreadId | null
  /**
   *  Exception type, e.g. `ValueError`.
   *
   *  At least one of `type` or `value` is required, otherwise the exception is discarded.
   */
  type?: string | null
  /**
   *  Human readable display value.
   *
   *  At least one of `type` or `value` is required, otherwise the exception is discarded.
   */
  value?: JsonLenientString | null
  [k: string]: unknown
}
/**
 *  The mechanism by which an exception was generated and handled.
 *
 *  The exception mechanism is an optional field residing in the [exception](#typedef-Exception).
 *  It carries additional information about the way the exception was created on the target system.
 *  This includes general exception values obtained from the operating system or runtime APIs, as
 *  well as mechanism-specific values.
 */
export type Mechanism = {
  /**
   *  Arbitrary extra data that might help the user understand the error thrown by this mechanism.
   */
  data?: {
    [k: string]: unknown
  } | null
  /**
   *  Optional human-readable description of the error mechanism.
   *
   *  May include a possible hint on how to solve this error.
   */
  description?: string | null
  /**
   *  Flag indicating whether this exception was handled.
   *
   *  This is a best-effort guess at whether the exception was handled by user code or not. For
   *  example:
   *
   *  - Exceptions leading to a 500 Internal Server Error or to a hard process crash are
   *    `handled=false`, as the SDK typically has an integration that automatically captures the
   *    error.
   *
   *  - Exceptions captured using `capture_exception` (called from user code) are `handled=true`
   *    as the user explicitly captured the exception (and therefore kind of handled it)
   */
  handled?: boolean | null
  /**
   *  Link to online resources describing this error.
   */
  help_link?: string | null
  /**
   *  Operating system or runtime meta information.
   */
  meta?: MechanismMeta | null
  /**
   *  If this is set then the exception is not a real exception but some
   *  form of synthetic error for instance from a signal handler, a hard
   *  segfault or similar where type and value are not useful for grouping
   *  or display purposes.
   */
  synthetic?: boolean | null
  /**
   *  Mechanism type (required).
   *
   *  Required unique identifier of this mechanism determining rendering and processing of the
   *  mechanism data.
   *
   *  In the Python SDK this is merely the name of the framework integration that produced the
   *  exception, while for native it is e.g. `"minidump"` or `"applecrashreport"`.
   */
  type: string | null
  [k: string]: unknown
}
/**
 *  Operating system or runtime meta information to an exception mechanism.
 *
 *  The mechanism metadata usually carries error codes reported by the runtime or operating system,
 *  along with a platform-dependent interpretation of these codes. SDKs can safely omit code names
 *  and descriptions for well-known error codes, as it will be filled out by Sentry. For
 *  proprietary or vendor-specific error codes, adding these values will give additional
 *  information to the user.
 */
export type MechanismMeta = {
  /**
   *  Optional ISO C standard error code.
   */
  errno?: CError | null
  /**
   *  A Mach Exception on Apple systems comprising a code triple and optional descriptions.
   */
  mach_exception?: MachException | null
  /**
   *  Information on the POSIX signal.
   */
  signal?: PosixSignal | null
  [k: string]: unknown
}
/**
 *  POSIX signal with optional extended data.
 *
 *  Error codes set by Linux system calls and some library functions as specified in ISO C99,
 *  POSIX.1-2001, and POSIX.1-2008. See
 *  [`errno(3)`](https://man7.org/linux/man-pages/man3/errno.3.html) for more information.
 */
export type CError = {
  /**
   *  Optional name of the errno constant.
   */
  name?: string | null
  /**
   *  The error code as specified by ISO C99, POSIX.1-2001 or POSIX.1-2008.
   */
  number?: number | null
  [k: string]: unknown
}
/**
 *  Mach exception information.
 */
export type MachException = {
  /**
   *  The mach exception code.
   */
  code?: number | null
  /**
   *  The mach exception type.
   */
  exception?: number | null
  /**
   *  Optional name of the mach exception.
   */
  name?: string | null
  /**
   *  The mach exception subcode.
   */
  subcode?: number | null
  [k: string]: unknown
}
/**
 *  POSIX signal with optional extended data.
 *
 *  On Apple systems, signals also carry a code in addition to the signal number describing the
 *  signal in more detail. On Linux, this code does not exist.
 */
export type PosixSignal = {
  /**
   *  An optional signal code present on Apple systems.
   */
  code?: number | null
  /**
   *  Optional name of the errno constant.
   */
  code_name?: string | null
  /**
   *  Optional name of the errno constant.
   */
  name?: string | null
  /**
   *  The POSIX signal number.
   */
  number?: number | null
  [k: string]: unknown
}
export type Stacktrace = RawStacktrace
/**
 *  A stack trace of a single thread.
 *
 *  A stack trace contains a list of frames, each with various bits (most optional) describing the context of that frame. Frames should be sorted from oldest to newest.
 *
 *  For the given example program written in Python:
 *
 *  ```python
 *  def foo():
 *      my_var = 'foo'
 *      raise ValueError()
 *
 *  def main():
 *      foo()
 *  ```
 *
 *  A minimalistic stack trace for the above program in the correct order:
 *
 *  ```json
 *  {
 *    "frames": [
 *      {"function": "main"},
 *      {"function": "foo"}
 *    ]
 *  }
 *  ```
 *
 *  The top frame fully symbolicated with five lines of source context:
 *
 *  ```json
 *  {
 *    "frames": [{
 *      "in_app": true,
 *      "function": "myfunction",
 *      "abs_path": "/real/file/name.py",
 *      "filename": "file/name.py",
 *      "lineno": 3,
 *      "vars": {
 *        "my_var": "'value'"
 *      },
 *      "pre_context": [
 *        "def foo():",
 *        "  my_var = 'foo'",
 *      ],
 *      "context_line": "  raise ValueError()",
 *      "post_context": [
 *        "",
 *        "def main():"
 *      ],
 *    }]
 *  }
 *  ```
 *
 *  A minimal native stack trace with register values. Note that the `package` event attribute must be "native" for these frames to be symbolicated.
 *
 *  ```json
 *  {
 *    "frames": [
 *      {"instruction_addr": "0x7fff5bf3456c"},
 *      {"instruction_addr": "0x7fff5bf346c0"},
 *    ],
 *    "registers": {
 *      "rip": "0x00007ff6eef54be2",
 *      "rsp": "0x0000003b710cd9e0"
 *    }
 *  }
 *  ```
 */
export type RawStacktrace = {
  /**
   *  Required. A non-empty list of stack frames. The list is ordered from caller to callee, or oldest to youngest. The last frame is the one creating the exception.
   */
  frames: (Frame | null)[] | null
  /**
   *  The language of the stacktrace.
   */
  lang?: string | null
  /**
   *  Register values of the thread (top frame).
   *
   *  A map of register names and their values. The values should contain the actual register values of the thread, thus mapping to the last frame in the list.
   */
  registers?: {
    [k: string]: RegVal | null
  } | null
  [k: string]: unknown
}
/**
 *  Holds information about a single stacktrace frame.
 *
 *  Each object should contain **at least** a `filename`, `function` or `instruction_addr` attribute. All values are optional, but recommended.
 */
export type Frame = {
  /**
   *  Absolute path to the source file.
   */
  abs_path?: NativeImagePath | null
  /**
   *  Defines the addressing mode for addresses.
   */
  addr_mode?: string | null
  /**
   *  Column number within the source file, starting at 1.
   */
  colno?: number | null
  /**
   *  Source code of the current line (`lineno`).
   */
  context_line?: string | null
  /**
   *  The source file name (basename only).
   */
  filename?: NativeImagePath | null
  /**
   *  Name of the frame's function. This might include the name of a class.
   *
   *  This function name may be shortened or demangled. If not, Sentry will demangle and shorten
   *  it for some platforms. The original function name will be stored in `raw_function`.
   */
  function?: string | null
  /**
   *  (C/C++/Native) Start address of the containing code module (image).
   */
  image_addr?: Addr | null
  /**
   *  Override whether this frame should be considered part of application code, or part of
   *  libraries/frameworks/dependencies.
   *
   *  Setting this attribute to `false` causes the frame to be hidden/collapsed by default and
   *  mostly ignored during issue grouping.
   */
  in_app?: boolean | null
  /**
   *  (C/C++/Native) An optional instruction address for symbolication.
   *
   *  This should be a string with a hexadecimal number that includes a 0x prefix.
   *  If this is set and a known image is defined in the
   *  [Debug Meta Interface]({%- link _documentation/development/sdk-dev/event-payloads/debugmeta.md -%}),
   *  then symbolication can take place.
   */
  instruction_addr?: Addr | null
  /**
   *  Line number within the source file, starting at 1.
   */
  lineno?: number | null
  /**
   *  Name of the module the frame is contained in.
   *
   *  Note that this might also include a class name if that is something the
   *  language natively considers to be part of the stack (for instance in Java).
   */
  module?: string | null
  /**
   *  Name of the package that contains the frame.
   *
   *  For instance this can be a dylib for native languages, the name of the jar
   *  or .NET assembly.
   */
  package?: string | null
  /**
   *  Which platform this frame is from.
   *
   *  This can override the platform for a single frame. Otherwise, the platform of the event is
   *  assumed. This can be used for multi-platform stack traces, such as in React Native.
   */
  platform?: string | null
  /**
   *  Source code of the lines after `lineno`.
   */
  post_context?: (string | null)[] | null
  /**
   *  Source code leading up to `lineno`.
   */
  pre_context?: (string | null)[] | null
  /**
   *  A raw (but potentially truncated) function value.
   *
   *  The original function name, if the function name is shortened or demangled. Sentry shows
   *  the raw function when clicking on the shortened one in the UI.
   *
   *  If this has the same value as `function` it's best to be omitted.  This
   *  exists because on many platforms the function itself contains additional
   *  information like overload specifies or a lot of generics which can make
   *  it exceed the maximum limit we provide for the field.  In those cases
   *  then we cannot reliably trim down the function any more at a later point
   *  because the more valuable information has been removed.
   *
   *  The logic to be applied is that an intelligently trimmed function name
   *  should be stored in `function` and the value before trimming is stored
   *  in this field instead.  However also this field will be capped at 256
   *  characters at the moment which often means that not the entire original
   *  value can be stored.
   */
  raw_function?: string | null
  /**
   *  Potentially mangled name of the symbol as it appears in an executable.
   *
   *  This is different from a function name by generally being the mangled
   *  name that appears natively in the binary.  This is relevant for languages
   *  like Swift, C++ or Rust.
   */
  symbol?: string | null
  /**
   *  (C/C++/Native) Start address of the frame's function.
   *
   *  We use the instruction address for symbolication, but this can be used to calculate
   *  an instruction offset automatically.
   */
  symbol_addr?: Addr | null
  /**
   *  Mapping of local variables and expression names that were available in this frame.
   */
  vars?: FrameVars | null
  [k: string]: unknown
}
/**
 *  Frame local variables.
 */
export type FrameVars = {
  [k: string]: unknown
}
export type RegVal = string
/**
 *  Represents a thread id.
 */
export type ThreadId = number | string
/**
 *  A "into-string" type of value. All non-string values are serialized as JSON.
 */
export type JsonLenientString = string
/**
 *  A fingerprint value.
 */
export type Fingerprint = string[]
/**
 *  A log entry message.
 *
 *  A log message is similar to the `message` attribute on the event itself but
 *  can additionally hold optional parameters.
 *
 *  ```json
 *  {
 *    "message": {
 *      "message": "My raw message with interpreted strings like %s",
 *      "params": ["this"]
 *    }
 *  }
 *  ```
 *
 *  ```json
 *  {
 *    "message": {
 *      "message": "My raw message with interpreted strings like {foo}",
 *      "params": {"foo": "this"}
 *    }
 *  }
 *  ```
 */
export type LogEntry = {
  /**
   *  The formatted message. If `message` and `params` are given, Sentry
   *  will attempt to backfill `formatted` if empty.
   *
   *  It must not exceed 8192 characters. Longer messages will be truncated.
   */
  formatted?: Message | null
  /**
   *  The log message with parameter placeholders.
   *
   *  This attribute is primarily used for grouping related events together into issues.
   *  Therefore this really should just be a string template, i.e. `Sending %d requests` instead
   *  of `Sending 9999 requests`. The latter is much better at home in `formatted`.
   *
   *  It must not exceed 8192 characters. Longer messages will be truncated.
   */
  message?: Message | null
  /**
   *  Parameters to be interpolated into the log message. This can be an array of positional
   *  parameters as well as a mapping of named arguments to their values.
   */
  params?: {
    [k: string]: unknown
  }
  [k: string]: unknown
}
export type Message = string
/**
 *  Http request information.
 *
 *  The Request interface contains information on a HTTP request related to the event. In client
 *  SDKs, this can be an outgoing request, or the request that rendered the current web page. On
 *  server SDKs, this could be the incoming web request that is being handled.
 *
 *  The data variable should only contain the request body (not the query string). It can either be
 *  a dictionary (for standard HTTP requests) or a raw request body.
 *
 *  ### Ordered Maps
 *
 *  In the Request interface, several attributes can either be declared as string, object, or list
 *  of tuples. Sentry attempts to parse structured information from the string representation in
 *  such cases.
 *
 *  Sometimes, keys can be declared multiple times, or the order of elements matters. In such
 *  cases, use the tuple representation over a plain object.
 *
 *  Example of request headers as object:
 *
 *  ```json
 *  {
 *    "content-type": "application/json",
 *    "accept": "application/json, application/xml"
 *  }
 *  ```
 *
 *  Example of the same headers as list of tuples:
 *
 *  ```json
 *  [
 *    ["content-type", "application/json"],
 *    ["accept", "application/json"],
 *    ["accept", "application/xml"]
 *  ]
 *  ```
 *
 *  Example of a fully populated request object:
 *
 *  ```json
 *  {
 *    "request": {
 *      "method": "POST",
 *      "url": "http://absolute.uri/foo",
 *      "query_string": "query=foobar&page=2",
 *      "data": {
 *        "foo": "bar"
 *      },
 *      "cookies": "PHPSESSID=298zf09hf012fh2; csrftoken=u32t4o3tb3gg43; _gat=1;",
 *      "headers": {
 *        "content-type": "text/html"
 *      },
 *      "env": {
 *        "REMOTE_ADDR": "192.168.0.1"
 *      }
 *    }
 *  }
 *  ```
 */
export type Request = {
  /**
   *  The cookie values.
   *
   *  Can be given unparsed as string, as dictionary, or as a list of tuples.
   */
  cookies?: Cookies | null
  /**
   *  Request data in any format that makes sense.
   *
   *  SDKs should discard large and binary bodies by default. Can be given as string or
   *  structural data of any format.
   */
  data?: {
    [k: string]: unknown
  }
  /**
   *  Server environment data, such as CGI/WSGI.
   *
   *  A dictionary containing environment information passed from the server. This is where
   *  information such as CGI/WSGI/Rack keys go that are not HTTP headers.
   *
   *  Sentry will explicitly look for `REMOTE_ADDR` to extract an IP address.
   */
  env?: {
    [k: string]: unknown
  } | null
  /**
   *  The fragment of the request URL.
   */
  fragment?: string | null
  /**
   *  A dictionary of submitted headers.
   *
   *  If a header appears multiple times it, needs to be merged according to the HTTP standard
   *  for header merging. Header names are treated case-insensitively by Sentry.
   */
  headers?: Headers | null
  /**
   *  The inferred content type of the request payload.
   */
  inferred_content_type?: string | null
  /**
   *  HTTP request method.
   */
  method?: string | null
  /**
   *  The query string component of the URL.
   *
   *  Can be given as unparsed string, dictionary, or list of tuples.
   *
   *  If the query string is not declared and part of the `url`, Sentry moves it to the
   *  query string.
   */
  query_string?:
    | (
        | string
        | (
            | {
                [k: string]: string | null
              }
            | ([string | null, string | null] | null)[]
          )
      )
    | null
  /**
   *  The URL of the request if available.
   *
   * The query string can be declared either as part of the `url`, or separately in `query_string`.
   */
  url?: string | null
  [k: string]: unknown
}
/**
 *  A map holding cookies.
 */
export type Cookies =
  | {
      [k: string]: string | null
    }
  | ([string | null, string | null] | null)[]
/**
 *  A map holding headers.
 */
export type Headers =
  | {
      [k: string]: HeaderValue | null
    }
  | ([HeaderName | null, HeaderValue | null] | null)[]
/**
 *  A "into-string" type that normalizes header values.
 */
export type HeaderValue = string
/**
 *  A "into-string" type that normalizes header names.
 */
export type HeaderName = string
/**
 *  The SDK Interface describes the Sentry SDK and its configuration used to capture and transmit an event.
 */
export type ClientSdkInfo = {
  /**
   *  List of integrations that are enabled in the SDK. _Optional._
   *
   *  The list should have all enabled integrations, including default integrations. Default
   *  integrations are included because different SDK releases may contain different default
   *  integrations.
   */
  integrations?: (string | null)[] | null
  /**
   *  Unique SDK name. _Required._
   *
   *  The name of the SDK. The format is `entity.ecosystem[.flavor]` where entity identifies the
   *  developer of the SDK, ecosystem refers to the programming language or platform where the
   *  SDK is to be used and the optional flavor is used to identify standalone SDKs that are part
   *  of a major ecosystem.
   *
   *  Official Sentry SDKs use the entity `sentry`, as in `sentry.python` or
   *  `sentry.javascript.react-native`. Please use a different entity for your own SDKs.
   */
  name: string | null
  /**
   *  List of installed and loaded SDK packages. _Optional._
   *
   *  A list of packages that were installed as part of this SDK or the activated integrations.
   *  Each package consists of a name in the format `source:identifier` and `version`. If the
   *  source is a Git repository, the `source` should be `git`, the identifier should be a
   *  checkout link and the version should be a Git reference (branch, tag or SHA).
   */
  packages?: (ClientSdkPackage | null)[] | null
  /**
   *  The version of the SDK. _Required._
   *
   *  It should have the [Semantic Versioning](https://semver.org/) format `MAJOR.MINOR.PATCH`,
   *  without any prefix (no `v` or anything else in front of the major version number).
   *
   *  Examples: `0.1.0`, `1.0.0`, `4.3.12`
   */
  version: string | null
  [k: string]: unknown
}
/**
 *  An installed and loaded package as part of the Sentry SDK.
 */
export type ClientSdkPackage = {
  /**
   *  Name of the package.
   */
  name?: string | null
  /**
   *  Version of the package.
   */
  version?: string | null
  [k: string]: unknown
}
/**
 *  Manual key/value tag pairs.
 */
export type Tags =
  | {
      [k: string]: string | null
    }
  | (TagEntry | null)[]
export type TagEntry = [string | null, string | null]
/**
 *  A process thread of an event.
 *
 *  The Threads Interface specifies threads that were running at the time an event happened. These threads can also contain stack traces.
 *
 *  An event may contain one or more threads in an attribute named `threads`.
 *
 *  The following example illustrates the threads part of the event payload and omits other attributes for simplicity.
 *
 *  ```json
 *  {
 *    "threads": {
 *      "values": [
 *        {
 *          "id": "0",
 *          "name": "main",
 *          "crashed": true,
 *          "stacktrace": {}
 *        }
 *      ]
 *    }
 *  }
 *  ```
 */
export type Thread = {
  /**
   *  A flag indicating whether the thread crashed. Defaults to `false`.
   */
  crashed?: boolean | null
  /**
   *  A flag indicating whether the thread was in the foreground.  Defaults to `false`.
   */
  current?: boolean | null
  /**
   *  The ID of the thread. Typically a number or numeric string.
   *
   *  Needs to be unique among the threads. An exception can set the `thread_id` attribute to cross-reference this thread.
   */
  id?: ThreadId | null
  /**
   *  Display name of this thread.
   */
  name?: string | null
  /**
   *  Stack trace containing frames of this exception.
   *
   *  The thread that crashed with an exception should not have a stack trace, but instead, the `thread_id` attribute should be set on the exception and Sentry will connect the two.
   */
  stacktrace?: Stacktrace | null
  [k: string]: unknown
}
/**
 * The type of an event.
 */
export type EventType =
  | "error"
  | "csp"
  | "hpkp"
  | "expectct"
  | "expectstaple"
  | "transaction"
  | "default"
/**
 *  Information about the user who triggered an event.
 *
 *  ```json
 *  {
 *    "user": {
 *      "id": "unique_id",
 *      "username": "my_user",
 *      "email": "foo@example.com",
 *      "ip_address": "127.0.0.1",
 *      "subscription": "basic"
 *    }
 *  }
 *  ```
 */
export type User = {
  /**
   *  Additional arbitrary fields, as stored in the database (and sometimes as sent by clients).
   *  All data from `self.other` should end up here after store normalization.
   */
  data?: {
    [k: string]: unknown
  } | null
  /**
   *  Email address of the user.
   */
  email?: string | null
  /**
   *  Approximate geographical location of the end user or device.
   */
  geo?: Geo | null
  /**
   *  Unique identifier of the user.
   */
  id?: string | null
  /**
   *  Remote IP address of the user. Defaults to "{{auto}}".
   */
  ip_address?: String | null
  /**
   *  Human readable name of the user.
   */
  name?: string | null
  /**
   *  Username of the user.
   */
  username?: string | null
  [k: string]: unknown
}
/**
 *  Geographical location of the end user or device.
 */
export type Geo = {
  /**
   *  Human readable city name.
   */
  city?: string | null
  /**
   *  Two-letter country code (ISO 3166-1 alpha-2).
   */
  country_code?: string | null
  /**
   *  Human readable region name or code.
   */
  region?: string | null
  [k: string]: unknown
}
export type String = string

