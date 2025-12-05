export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen space-x-2">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </div>
    );
}
