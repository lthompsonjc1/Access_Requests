export interface Device {
  hostname: string;
  os: string;
  serial: string;
  lastContact: string;
  agent: string;
  mdm: boolean;
  compliant: boolean;
  user: string;
}
