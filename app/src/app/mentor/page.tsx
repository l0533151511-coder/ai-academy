export const metadata = {
  title: "AI Mentor",
  description: "מנטור AI סוקרטי שמכוון בשאלות ורמזים במקום לפתור — בונה חשיבה עצמאית.",
};

export default function MentorPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">ה-AI Mentor שלך</h1>
      <p className="mt-3 text-muted">
        המנטור זמין בכל עמוד דרך הכפתור הצף בפינה. הוא לא ייתן לך פתרון מיד — הוא ילווה אותך ברמזים
        עד שתגיע לפתרון בעצמך.
      </p>
    </div>
  );
}
