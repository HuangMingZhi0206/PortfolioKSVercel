import {
  Code, Cpu, Wifi, Globe, Shield, Server, Terminal,
  Bot, Cog, MessageSquare, Languages, Network, HardDrive, Wrench,
  Lightbulb, Radio, BrainCircuit, Palette,
  FileCode, Microscope, Router, Flag, Rocket,
  MonitorSmartphone, ClipboardList,
} from 'lucide-react'

// CDN logo URLs for well-known tech brands (devicon)
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

export const skillLogoUrls = {
  'Python': `${DEVICON}/python/python-original.svg`,
  'C++': `${DEVICON}/cplusplus/cplusplus-original.svg`,
  'JavaScript': `${DEVICON}/javascript/javascript-original.svg`,
  'Arduino': `${DEVICON}/arduino/arduino-original.svg`,
  'Raspberry Pi': `${DEVICON}/raspberrypi/raspberrypi-original.svg`,
  'ESP32': `${DEVICON}/embeddedc/embeddedc-original.svg`,
  'MQTT': `${DEVICON}/mosquitto/mosquitto-original.svg`,
  'Back-End Development': `${DEVICON}/nodejs/nodejs-original.svg`,
  'System Administration': `${DEVICON}/linux/linux-original.svg`,
  'Network Engineering': `${DEVICON}/networkx/networkx-original.svg`,
  'Networking': `${DEVICON}/networkx/networkx-original.svg`,
  'Network Administration': `${DEVICON}/networkx/networkx-original.svg`,
  'Graphic Design': `${DEVICON}/canva/canva-original.svg`,
}

// Lucide fallbacks + brand colors for skills without a CDN logo
export const skillFallbackMap = {
  'Python': { icon: Code, color: '#3776AB' },
  'C++': { icon: Terminal, color: '#00599C' },
  'JavaScript': { icon: FileCode, color: '#B7950B' },
  'Arduino': { icon: Cpu, color: '#00979D' },
  'Raspberry Pi': { icon: Cpu, color: '#C51A4A' },
  'ESP32': { icon: Cpu, color: '#E7352C' },
  'MQTT': { icon: Radio, color: '#660066' },
  'Internet of Things (IoT)': { icon: Wifi, color: '#2E86C1' },
  'Network Engineering': { icon: Router, color: '#1BA0D7' },
  'Robotics': { icon: Bot, color: '#E67E22' },
  'Mobile Robotics': { icon: Bot, color: '#F97316' },
  'Robot Programming': { icon: BrainCircuit, color: '#0891B2' },
  'Back-End Development': { icon: Server, color: '#339933' },
  'Embedded Systems': { icon: Microscope, color: '#D97706' },
  'Network Security': { icon: Shield, color: '#16A34A' },
  'Network Administration': { icon: Network, color: '#2563EB' },
  'System Administration': { icon: MonitorSmartphone, color: '#A16207' },
  'Graphic Design': { icon: Palette, color: '#DB2777' },
  'Communication': { icon: MessageSquare, color: '#7C3AED' },
  'Leadership': { icon: Rocket, color: '#CA8A04' },
  'Project Management': { icon: ClipboardList, color: '#0D9488' },
  'Bahasa Indonesia': { icon: Flag, color: '#DC2626' },
  'English': { icon: Languages, color: '#2563EB' },
  'Waste Management': { icon: Lightbulb, color: '#16A34A' },
  'Engineering': { icon: Wrench, color: '#78716C' },
  'Networking': { icon: Globe, color: '#0284C7' },
  'Information Technology Infrastructure': { icon: HardDrive, color: '#64748B' },
}

export const getSkillData = (skillName) => {
  const fallback = skillFallbackMap[skillName] || { icon: Cog, color: '#6B7280' }
  return { ...fallback, logo: skillLogoUrls[skillName] || null }
}
