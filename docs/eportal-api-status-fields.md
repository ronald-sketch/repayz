# ePortal API - Machine Status Documentation

Based on the official ePortal API documentation PDF.

## Key Status Fields from rvmStats API

| Field | Example Value | Description |
|-------|---------------|-------------|
| **RVMStatusReady** | 0 or 75288 | 0 = NOT ready, non-zero = ready (counter/uptime value) |
| **RVMStatusError** | 51778 | Error counter (non-zero indicates errors have occurred) |
| **RVMStatusProcessing** | 0 or 322 | Items currently being processed per minute |
| **RVMStatusBarcodeCount** | 6956 | Total barcodes scanned |
| **RVMStatusBarcodeDate** | "2016-05-30T13:00:15" | Last barcode scan date |
| **RVMStatusStateDateGMT** | "2023-04-21T15:54:18" | State change date in GMT |
| **RVMStatusLastTime** | "2023-04-21T14:24:44" | Last status update time |
| **RVMStatusReportDate** | "2023-04-21T14:24:42" | Last report date |
| **RVMStatusErrorNoClose** | 0 or 51778 | Door close error counter |

## StatusInfo Fields

| Field | Example Value | Description |
|-------|---------------|-------------|
| **StatusInfoState** | "Error" or "" | Current machine state - **KEY FIELD** |
| **StatusInfoMeter** | 0 | Total items processed (lifetime counter) |
| **StatusInfoProcessing** | 0 | Currently processing |
| **StatusInfoUptime** | 9084 | Uptime in minutes |
| **StatusInfoRestarts** | 4 | Number of restarts |
| **StatusInfoReboots** | 1 | Number of reboots |
| **StatusInfoLastReport** | "2023-04-21T14:24:44" | Last report timestamp |

## State Change Events (Event 40011)

According to page 21 of the documentation:

> "When an RVM changes it's state and an event configuration is looking for event 40011 that RVM's state will be reported to the REST API endpoint after the next report from the RVM. **Only 4 states are acted on**, which will be reported in the eventData object in the machineState field."

### The 4 Machine States:

| State | Description |
|-------|-------------|
| **Error** | Machine has an error |
| **Ready** | Machine is operational and ready to accept items |
| **Door** | Door is open |
| **Door(Tech)** | Door is open AND a technician has logged in |

### Example Event JSON:
```json
{
  "events": [{
    "siteId": "999626",
    "rvmId": "999626",
    "eventId": 40011,
    "event": "State of the machine changed.",
    "time": "2021-12-08T13:43:30",
    "eventData": {
      "machineState": "Ready"
    }
  }],
  "customData": "test2"
}
```

## Available Events (from page 18)

### Bin Full Events:
- **9200**: Bin full by sensor~*
- **9201**: Bin 1 full by sensor~*
- **9202**: Bin 2 full by sensor~*
- **9203**: Bin 3 full by sensor~*
- **9204**: Bin 4 full by sensor~*
- **9210**: Bin full by count~*
- **9211**: Bin 1 full by count~*
- **9212**: Bin 2 full by count~*
- **9213**: Bin 3 full by count~*
- **9214**: Bin 4 full by count~*

### Other Events:
- **1010**: Remove Container from Intake
- **1012**: Take your Receipt
- **1013**: Receipt requested
- **1014**: Receipt requested
- **1015**: Please empty Reject Chute
- **1016**: Please remove container first
- **1151**: Next Container was inserted too early
- **1152**: Bin Door 1 open~
- **1153**: ...wait for recovery !
- **1154**: Receipt is printing
- **1155**: Don't forget your Receipt
- **1156**: Rvm-Init detected that not all Bins are ready.
- **1157**: Do not feed containers !
- **1158**: Press button for Receipt or insert next Container
- **9304**: Printer: Out of Paper

### Offline Events:
- **40012**: RVM missed 2 check-ins (considered offline)
- **40013**: RVM missed 5 check-ins
- **40014**: RVM missed 10 check-ins

## Current Implementation vs Documentation

### Current Code:
```typescript
status: rvmData.RVMStatusReady ? 'operational' : 'offline'
```

### Recommended Implementation:
```typescript
function determineStatus(rvmData: any): 'operational' | 'error' | 'door_open' | 'maintenance' | 'offline' {
  // Check StatusInfoState first (most reliable)
  const state = rvmData.StatusInfoState?.toLowerCase() || '';
  
  if (state === 'error') return 'error';
  if (state === 'door' || state === 'door(tech)') return 'door_open';
  if (state === 'ready') return 'operational';
  
  // Fallback to RVMStatusReady
  if (!rvmData.RVMStatusReady) return 'offline';
  
  return 'operational';
}
```

## Summary

The ePortal API uses **4 main states** for machine status:
1. **Ready** - Machine is operational
2. **Error** - Machine has an error
3. **Door** - Door is open (service access)
4. **Door(Tech)** - Door is open with technician logged in

The `StatusInfoState` field contains the current state as a string. When empty or "Ready", the machine is operational.
