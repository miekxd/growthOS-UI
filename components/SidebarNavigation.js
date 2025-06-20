import Link from "next/link"
import { useState } from "react"
import {
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Search,
  Pencil,
  Bot,
  FolderPlus,
  Folder,
  User2,
  BookOpen
} from "lucide-react"

export default function SidebarNavigation({ currentPage = "knowledge" }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const toggleSidebar = () => setIsExpanded(v => !v)

  const sections = [
    {
      title: "Favorites",
      items: [
        { href: "#", icon: <User2 size={16} />, label: "User" },
        {
          href: "/knowledge",
          icon: <BookOpen size={16} />,
          label: "Knowledge",
          active: currentPage === "knowledge"
        }
      ]
    },
    {
      title: "Actions",
      items: [
        {
          href: "/curate",
          icon: <Search size={16} />,
          label: "Curate Knowledge",
          active: currentPage === "curate"
        },
        {
          href: "/test",
          icon: <Pencil size={16} />,
          label: "Self Test",
          active: currentPage === "test"
        },
        {
          href: "/agents",
          icon: <Bot size={16} />,
          label: "Deploy Agents",
          active: currentPage === "agents"
        }
      ]
    },
    {
      title: "Workspace",
      items: [
        ...[1, 2, 3].map(n => ({
          href: `/workspace/${n}`,
          icon: <Folder size={16} />,
          label: `Workspace ${n}`
        })),
        {
          href: "/workspace/new",
          icon: <FolderPlus size={16} />,
          label: "Add Workspace",
          dark: true
        }
      ]
    }
  ]

  return (
    //can fix later on about scrollbar when zooming in
    <aside
      className={`
        relative flex flex-col transition-all duration-300
        h-screen p-3 rounded-2xl
        ${isExpanded ? "w-64" : "w-16"}
        bg-white/30 backdrop-blur-md shadow-xl
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center h-12 px-4 border-b border-white
          ${isExpanded ? "justify-between" : "justify-center"}`}
      >
        {/* Left: title & action icons only when expanded */}
        {isExpanded && (
          <>
            <h1 className="text-lg font-bold text-lime-300">logo</h1>
            <button className="bg-white/20 rounded-full p-1 hover:bg-white/30 transition">
              <Settings size={16} />
            </button>
            <button className="bg-white/20 rounded-full p-1 hover:bg-white/30 transition">
              <HelpCircle size={16} />
            </button>
          </>
        )}

        {/* Toggle: always rendered, placed by the flex container */}
        <button
          onClick={toggleSidebar}
          className="bg-white/20 rounded-full p-1 hover:bg-white/30 transition"
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        {sections.map(({ title, items }) => (
          <NavSection
            key={title}
            title={title}
            items={items}
            isExpanded={isExpanded}
          />
        ))}
      </nav>
    </aside>
  )
}

function NavSection({ title, items, isExpanded }) {
  return (
    <section className="mb-4">
      <div className="border-b border-white pt-0 pb-4">
        <div className="pb-2">
          <h3> {title}</h3>
        </div>
        <div className="flex flex-col space-y-3">
          {items.map(item => (
            <NavItem key={item.label} {...item} isExpanded={isExpanded} />
          ))}
        </div>
      </div>
    </section>
  )
}

function NavItem({
  href,
  icon,
  label,
  isExpanded,
  active = false,
  dark = false
}) {
  // flex items-center justify-between px-3 py-2 rounded-xl transition h-full max-h-10
  // ${isExpanded ? 'flex items-center justify-between px-3 py-2 rounded-xl h-full max-h-10' :
  //   'flex items-center justify-between px-3 py-2 rounded-xl h-full max-h-10'}
  return (
    <Link
      href={href}
      className={`
        flex items-center justify-between px-3 py-2 rounded-xl h-10
        ${
          dark
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-white text-gray-800 hover:bg-gray-100"
        }
        ${active && !dark ? "ring-2 ring-blue-500" : ""}
      `}
      aria-current={active ? "page" : undefined}
      title={!isExpanded ? label : undefined}
    >
      <div className="flex items-center gap-2">
        {icon}
        {isExpanded && <span className="truncate w-full">{label}</span>}
      </div>
      {isExpanded && (
        <ChevronRight size={16} className="text-gray-400 transform rotate-90" />
      )}
    </Link>
  )
}
