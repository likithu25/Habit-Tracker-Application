export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-center py-4 mt-10 border-t border-neutral-800">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Likith U. All rights reserved.
      </p>
    </footer>
  );
}
